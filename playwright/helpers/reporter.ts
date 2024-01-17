import * as fs from 'fs'

import { TestCase, TestResult, Reporter, FullResult } from '@playwright/test/reporter'

export interface SlackMessage {
  text: string
  blocks?: {
    type: string
    text: {
      type: string
      text: string
    }
  }[]
}
interface ITest {
  tests: string[]
  count: number
}
export interface Summary {
  durationInMS: number
  passed: ITest
  failed: ITest
  flakey: ITest
  interrupted: ITest
  timedOut: ITest
  skipped: ITest
  warned: ITest
  status: FullResult['status'] | 'unknown' | 'warned' | 'skipped'
}

class JSONSummaryReporter implements Reporter, Summary {
  durationInMS = -1
  passed: ITest = { tests: [], count: 0 }
  failed: ITest = { tests: [], count: 0 }
  flakey: ITest = { tests: [], count: 0 }
  interrupted: ITest = { tests: [], count: 0 }
  timedOut: ITest = { tests: [], count: 0 }
  skipped: ITest = { tests: [], count: 0 }
  warned: ITest = { tests: [], count: 0 }

  status: Summary['status'] = 'unknown'
  startedAt = 0
  private github_actions_check = ':github_actions_check:'
  private github_actions_x = ':github_actions_x:'
  private github_actions_warning = ':github_actions_warning:'

  private getStatus(test: TestCase, result: TestResult) {
    const title: string[] = []
    let clean = true
    for (const s of test.titlePath()) {
      if (s === '' && clean) continue
      clean = false
      title.push(s)
    }
    // Using the t variable in the push will push a full test name + test description
    const testTitle = title.join(' > ')

    return !['passed', 'skipped'].includes(result.status) && testTitle.includes('@warn') ? 'warned' : result.status
  }

  private dedupe(tests: string[]): string[] {
    return tests.filter((element, index) => tests.indexOf(element) === index)
  }

  onBegin() {
    this.startedAt = Date.now()
  }

  onTestEnd(test: TestCase, result: TestResult) {
    const testLocation = `${test.parent.parent?.title}:${test.parent.title}:${test.title}`
    const status = this.getStatus(test, result)
    // Logic to push the results into the correct array
    if (result.status === 'passed' && result.retry >= 1) {
      this.flakey.tests.push(testLocation)
    } else {
      this[`${status}`].tests.push(testLocation)
    }
    this[`${status}`].tests.push(testLocation)
  }

  getSummary(result: FullResult) {
    this.durationInMS = Date.now() - this.startedAt
    this.status = result.status

    // removing duplicate tests from passed array
    this.passed.tests = this.dedupe(this.passed.tests)
    this.passed.count = this.passed.tests.length

    // removing duplicate tests from the timedOut array
    this.timedOut.tests = this.dedupe(this.timedOut.tests)
    this.timedOut.count = this.timedOut.tests.length

    // removing duplicate tests from the failed array
    const arr: string[] = []
    this.failed.tests = arr.concat(
      this.timedOut.tests,
      this.failed.tests.filter((element, index) => {
        if (!this.passed.tests.includes(element)) return this.failed.tests.indexOf(element) === index
      })
    )
    this.failed.count = this.failed.tests.length + this.timedOut.count

    // removing duplicate tests from the skipped array
    this.skipped.tests = this.dedupe(this.skipped.tests)
    this.skipped.count = this.skipped.tests.length

    // removing duplicate tests from the interrupted array
    this.interrupted.tests = this.dedupe(this.interrupted.tests)
    this.interrupted.count = this.interrupted.tests.length
  }

  private getIcon(status: Summary['status']) {
    switch (status) {
      case 'passed':
        return this.github_actions_check
      case 'failed':
        return this.github_actions_x
      case 'warned':
        return this.github_actions_warning
      default:
        return this.github_actions_warning
    }
  }

  getResultsString(results: string[], status: Summary['status']) {
    const icon = this.getIcon(status)

    return results.length > 0 ? results.map((r, i) => `${i === 0 ? '' : ' '}_${r}_ ${icon} `).join() : ''
  }

  onEnd(result: FullResult) {
    this.getSummary(result)

    const passed_tests = this.getResultsString(this.passed.tests, 'passed')
    const failed_tests = this.getResultsString(this.failed.tests, 'failed')
    const flakey_tests = this.getResultsString(this.flakey.tests, 'failed')
    const skipped_tests = this.getResultsString(this.skipped.tests, 'skipped')
    const payload = {
      status: this.status,
      emoji: this.getIcon(this.status),
      passed_tests,
      failed_tests,
      flakey_tests,
      skipped_tests,
      passed_count: this.passed.count,
      failed_count: this.failed.count,
      flakey_count: this.flakey.count,
      skipped_count: this.skipped.count
    }
    fs.writeFileSync('./summary.json', JSON.stringify(payload, null, '  '))
  }
}

export default JSONSummaryReporter


