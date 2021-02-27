import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

function App() {

  const [employees, setEmployees] = useState([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [jobTitle, setJobTitle] = useState('')

  const [viewForm, setViewForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editField, setEditField] = useState('')
  const [deleting, setDeleting] = useState(false)

  const [propSort, setPropSort] = useState('')
  const [ascDesc, setAscDesc] = useState(false)

  const [focus, setFocus] = useState('')

  const inputRef1 = useRef()
  const inputRef2 = useRef()
  const inputRef3 = useRef()
  const inputRef4 = useRef()
  const scrollBot = useRef(null)
  const dataCount = useRef(false)

  useEffect(() => {
    console.log(ifLastEmp())
    fetchEmployeeData()
  }, [])

  /* CRUD OPERATIONS START */

  const fetchEmployeeData = () => {
    setLoading(true)

    axios.get('/api/employees')
      .then(res => {
        console.log('Data: ')
        console.log(res.data)
        setEmployees(res.data)
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  const deleteEmployee = (id) => {
    setLoading(true)
    axios
      .delete(`/api/employees/${id}`)
      .then(() => {
        console.log(`deleted employee # ${id}`)
        fetchEmployeeData()
      })
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))
  }

  const updateEmployee = (e, id) => {
    if (e.key === 'Enter') {

      let updatedEmployee = currentStateObject()

      console.log(updatedEmployee)
      setLoading(true)
      axios
        .put(`/api/employees/${id}`, updatedEmployee)
        .then(() => {
          console.log(`updated employee # ${id}`)
          fetchEmployeeData()
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false))

      setEditField('')
    }
  }

  /* CRUD OPERATIONS END */

  const resetFormValues = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setJobTitle('')
  }

  const currentStateObject = () => ({
    firstName,
    lastName,
    email,
    jobTitle
  })

  const handleSubmit = () => {
    console.log('submit')
    dataCount.current = true
    let newEmployee = currentStateObject()

    setLoading(true)
    axios
      .post('/api/employees', newEmployee)
      .then(() => fetchEmployeeData())
      .catch((err) => console.log(err))
      .finally(() => setLoading(false))

    setViewForm(false)
    resetFormValues()
    scrollBot.current.scrollIntoView()
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      
      switch(focus) {
        case 'fn':
          setFocus('ln')
          inputRef2.current.focus()
          break;
        case 'ln':
          setFocus('em')
          inputRef3.current.focus()
          break;
        case 'em':
          setFocus('jt')
          inputRef4.current.focus()
          break;
        case 'jt':
          setFocus('fn')
          inputRef1.current.focus()
          handleSubmit()
          break;
        default:
          break;
      }

    }
  }

  const handleFocus = e => {
    setFocus(e.target.name)
  }

  const ifLastEmp = emp => {
    if (dataCount.current && emp.id === employees[employees.length - 1].id) {
      setTimeout(() => dataCount.current = false, 1000)
      return 'last-emp'
    } else {
      return ''
    }
  }

  const handleMouseOver = (e) => {
    setTimeout(() => inputRef1.current.focus(), 1)
    setViewForm(true)
    setEditField('')
    resetFormValues()
  }

  const empty = (value) => value ? { color: 'black' } : { color: '#DFDFDF'}

  const addOrRemoveClass = (elementToSelect, addOrRemove, classToAdd) => document.querySelector(elementToSelect).classList[addOrRemove](classToAdd)

  const editableField = (e, emp) => {
    console.log(e.target.name)
    if (editField !== emp.id && !deleting) {
      setEditField(emp.id)
      setFirstName(emp.firstName)
      setLastName(emp.lastName)
      setJobTitle(emp.jobTitle)
      setEmail(emp.email)
    }
  }

  const adjustSorting = propToSort => {
    setPropSort(propToSort)
    setAscDesc(!ascDesc)
  }

  let filteredEmployees = [...employees]

  if (propSort === 'id') {
    if (ascDesc) filteredEmployees.sort((a, b) => a[propSort] - b[propSort])
    else filteredEmployees.sort((b, a) => a[propSort] - b[propSort])
  } else {
    if (ascDesc) filteredEmployees.sort((a, b) => a[propSort]?.[0] > b[propSort]?.[0] ? 1 : -1)
    else filteredEmployees.sort((b, a) => a[propSort]?.[0] > b[propSort]?.[0] ? 1 : -1)
  }

  return (
    <div className="App">
      <h1>Employees App</h1>
      <h3 style={{ color: 'grey' }}>(Spring Boot + React + Postgres)</h3>
      
      {viewForm ?
      <form onKeyPress={handleKeyPress} onSubmit={handleSubmit} onMouseLeave={() => setViewForm(false)}>
        <label>
          First Name:
          <input 
            name='fn'
            value={firstName} 
            ref={inputRef1}
            onFocus={handleFocus}
            onChange={(e) => setFirstName(e.target.value)} 
          />
        </label>
        <label>
          Last Name:
          <input 
            name='ln'
            value={lastName} 
            ref={inputRef2}
            onFocus={handleFocus}
            onChange={(e) => setLastName(e.target.value)} 
          />
        </label>
        <label>
          Email:
          <input 
            name='em'
            value={email} 
            ref={inputRef3}
            onFocus={handleFocus}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </label>
        <label>
          Job Title:
          <input 
            name='jt'
            value={jobTitle} 
            ref={inputRef4}
            onFocus={handleFocus}
            onChange={(e) => setJobTitle(e.target.value)} 
          />
        </label>
      </form>
      : <div className='hidden-form' onMouseOver={handleMouseOver}>New Employee</div>}

    {filteredEmployees.length ? 

      <table>
        
        <thead>
          <tr>
            <th onClick={() => adjustSorting('id')}>ID</th>
            <th onClick={() => adjustSorting('lastName')}>Last Name</th>
            <th onClick={() => adjustSorting('firstName')}>First Name</th>
            <th onClick={() => adjustSorting('jobTitle')}>Job Title</th>
            <th onClick={() => adjustSorting('email')}>Email</th>
          </tr>
        </thead>
        
      
        <tbody>
          {filteredEmployees.map(emp => 
            <tr 
              key={emp.id} 
              className={ifLastEmp(emp)} 
              onMouseOver={() => addOrRemoveClass(`.td-${emp.id}`, 'add', 'view-td')}
              onMouseLeave={() => addOrRemoveClass(`.td-${emp.id}`, 'remove', 'view-td')}
              onClick={(e) => editableField(e, emp)}
              onKeyPress={(e) => updateEmployee(e, emp.id)}
            >

            {viewForm || editField !== emp.id ? 
              <>
                <td>{emp.id}</td>
                <td style={empty(emp.lastName)} onClick={() => setTimeout(() => inputRef1.current.focus(), 1)}>
                  {emp.lastName || 'empty'}
                </td>
                <td style={empty(emp.firstName)} onClick={() => setTimeout(() => inputRef2.current.focus(), 1)}>
                  {emp.firstName || 'empty'}
                </td>
                <td style={empty(emp.jobTitle)} onClick={() => setTimeout(() => inputRef3.current.focus(), 1)}>
                  {emp.jobTitle || 'empty'}
                </td>
                <td style={empty(emp.email)} onClick={() => setTimeout(() => inputRef4.current.focus(), 1)}>
                  {emp.email || 'empty'}
                </td>

                <td 
                  onMouseOver={() => setDeleting(true)}
                  onMouseLeave={() => setDeleting(false)}
                  name='delete' 
                  className={`td-standard td-${emp.id}`} 
                  onClick={() => deleteEmployee(emp.id)}>
                  X
                </td>
              </>
              : 

              <>

                <td>{emp.id}</td>
                <td>
                  <input ref={inputRef1} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </td>
                <td>
                  <input ref={inputRef2} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </td>
                <td>
                  <input ref={inputRef3} value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
                </td>
                <td>
                  <input ref={inputRef4} value={email} onChange={(e) => setEmail(e.target.value)} />
                </td>
                <td className={`td-standard td-${emp.id}`} onClick={() => deleteEmployee(emp.id)}></td>

              </>
              
              }

            </tr>
          )}
        </tbody>
        <tbody style={{ display: loading ? 'flex' : 'none' }} className='loader-body'>
          <tr className='loader'></tr>
        </tbody>
      </table>

    : ''}

      <div ref={scrollBot}></div>

    </div>
  );
}

export default App;
