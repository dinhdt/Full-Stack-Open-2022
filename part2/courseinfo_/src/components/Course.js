const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><strong>total of exercises {sum}</strong></p>

const Part = ({ part }) => <p>{part.name} {part.exercises}</p>

const Content = (props) => <div>{props.parts.map(part => <Part key={part.id} part={part} />)}</div>

const Course = (props) => {
const initialValue = 0;
const sumWithInitial = props.course.parts.reduce(
  (accumulator, currentValue) => accumulator + currentValue.exercises, initialValue)

  return (
    <div>
      <Header course={props.course.name} />
      <Content parts={props.course.parts} />
      <Total sum={sumWithInitial} />
    </div>
    )
}

export default Course