const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ sum }) => <p><strong>total of exercises {sum}</strong></p>

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


const Part = ({ part }) => 
  <p>
    {part.name} {part.exercises}
  </p>

const Content = (props) => {
  return(
    <>
    {props.parts.map(part => <Part key={part.id} part={part} />)}
    </>
  )

}


const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      },
      {
        name: 'Redux',
        exercises: 11,
        id: 4
      }
    ]
  }

  return <Course course={course} />
}

export default App