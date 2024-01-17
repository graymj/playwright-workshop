import { Page } from '@playwright/test'
import fs from 'fs'
import path from 'path'

export const MOCK_DIR = './playwright/mocks'

export const fileExists = (filePath: string): boolean => fs.existsSync(filePath)

type Content = {
  size: number
  mimeType: string
  _file?: string
}
type HAREntry = {
  [key: string]: {
    status: number
    content: Content
  }
}
export class Mock {
  private page: Page
  private basePath: string
  private subDirectory: string
  private routeMap: HAREntry

  constructor(page: Page, basePath: string) {
    this.page = page
    this.basePath = basePath
    this.subDirectory = ''
    this.routeMap = {}
  }

  private getUrlEndpoint = (url: string): string => url.split('/api/')[1]
  private readFile = (...paths: string[]): string => fs.readFileSync(path.join(process.cwd(), ...paths), 'utf8')

  private getHAREntries = (harPath: string) => {
    const har = this.readFile(this.basePath, harPath)
    const harJson = JSON.parse(har)
    const harEntries = harJson.log.entries
    this.routeMap = harEntries.reduce((acc: any, entry: any) => {
      const url = this.getUrlEndpoint(entry.request.url)
      const method = entry.request.method
      const requestKey = `${method}-${url}`
      if (!acc[requestKey]) {
        const { status, content } = entry.response
        const response = {
          status: status || 200,
          content
        }
        acc[requestKey] = response
      }
      return acc
    }, {})
  }

  private getContent = (content: Content): string | undefined => {
    if (content?._file) {
      const contentString = this.readFile(this.basePath, this.subDirectory, content._file)
      return JSON.parse(contentString)
    }
  }

  private getDataFromHAR = () => {
    const routes = Object.keys(this.routeMap).map((entryKey: string) => {
      const [method, url] = entryKey.split('-')
      const { status, content } = this.routeMap[entryKey]
      return {
        method,
        url,
        status,
        content: this.getContent(content)
      }
    })
    return routes
  }

  private convertHarToRouteMock = async (harPath: string) => {
    // create routeMap from HAR entries
    this.getHAREntries(harPath)

    // create routes from routeMap
    await Promise.all(
      this.getDataFromHAR().map(async route => {
        if (route.status && route.content) {
          await this.page.route(`**/api/${route.url}`, async api => {
            console.log('route status: ', route.status)
            if (route.status === -1) return
            console.log('*************** hitting route: ', api.request().url())
            await api.fulfill({
              status: route.status,
              body: JSON.stringify(route.content)
            })
          })
        }
      })
    )
  }

  private getSubDirectory = (outputFile: string): string => {
    const subDirectory = outputFile.split('/').slice(0, -1).join('/')
    return subDirectory
  }

  route = async (config: { outputFile: string; url: string; forceUpdate?: boolean }) => {
    const { outputFile, url, forceUpdate } = config

    if (!process.env.CI) {
      console.log('running locally')
      const harPath = path.join(this.basePath, outputFile)
      return this.page.routeFromHAR(harPath, {
        url,
        update: forceUpdate || !fileExists(harPath)
      })
    }

    console.log('running in CI')
    this.subDirectory = this.getSubDirectory(outputFile)
    await this.convertHarToRouteMock(outputFile)
  }

  unroute = async (url: string) => {
    if (process.env.CI) {
      await Promise.all(
        Object.keys(this.routeMap).map(async (route: string) => {
          console.log('unrouting: ', route)
          const [_, url] = route.split('-')
          await this.page.unroute(url)
        })
      )
    } else {
      await this.page.unroute(url)
    }
  }
}
