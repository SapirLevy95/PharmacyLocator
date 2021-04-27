import "./App.css"


function Welcome(props) {
  console.log('Welcome')
  console.log(props)
  return (
    <div>
      <h1>Welcome {props.name} your date of birth is {props.dateOfBirth}.</h1>
    </div>
  );
}


function App() {
  const persons = [
    { name: "Moshe", dateOfBirth: "2324" },
    { name: "Yaniv", dateOfBirth: "324535" },
    { name: "Sagiv", dateOfBirth: "43534" }
  ];

  const test = <div>
    {persons.map(person => {
      return (<Welcome name={person.name} dateOfBirth={person.dateOfBirth} />)
    })}
  </div>

  return (
    <div>
      <h1>Home page</h1>
      {test}
    </div>
  );
}




export default App;
