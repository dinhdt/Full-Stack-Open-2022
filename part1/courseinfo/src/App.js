// const App = () => {
//   const course = 'Half Stack application development'
//   const part1 = 'Fundamentals of React'
//   const exercises1 = 10
//   const part2 = 'Using props to pass data'
//   const exercises2 = 7
//   const part3 = 'State of a component'
//   const exercises3 = 14

//   return (
//     <div>
//       <h1>{course}</h1>
//       <p>
//         {part1} {exercises1}
//       </p>
//       <p>
//         {part2} {exercises2}
//       </p>
//       <p>
//         {part3} {exercises3}
//       </p>
//       <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
//     </div>
//   )
// }
const Part = (props) => {
  return (
    <div>
      <p>
        {props.object.name} {props.object.exercises}
      </p>
    </div>
  )
}

const Header = (props) => {
  console.log(props)
  return (
    <div>
    <h1>{props.course}</h1>
    </div>
  )
}

const Content = (props) => {
  return (
    <div>
      <Part object={props.parts[0]} />
      <Part object={props.parts[1]} />
      <Part object={props.parts[2]} />
    </div>
  )
}
const Total = (props) => {
  return (
    <div>
    <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </div>
  )
}


const App = () => {
  // const-definitions
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}


export default App