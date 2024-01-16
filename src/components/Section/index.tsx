type Props = {
  name: string
  data: { id: number; name: string }[]
}
export default function Section(props: Props) {
  return (
    <section className="mb-3">
      <h3 className="text-l font-bold">{props.name}</h3>
      <ul>
        {props.data.map((item) => (
          <li key={`${item.id}-${props.name}`}>{item.name}</li>
        ))}
      </ul>
    </section>
  )
}
