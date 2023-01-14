import { useState, useEffect, useContext } from 'react'


import Header from '../../components/Header'
import Title from '../../components/Title'

import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'

import { FiPlusCircle } from 'react-icons/fi'
import './new.css'
import { toast } from 'react-toastify'

import { useParams, useNavigate } from 'react-router-dom'

const listRef = collection(db, 'customers')

export default function New() {

  const { user } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()

  const [customers, setCustomers] = useState([])
  const [loadCustomer, setLoadCustomer] = useState(true)
  const [customerSelected, setCustomerSelected] = useState(0)


  const [subject, setSubject] = useState('Suporte')
  const [status, setStatus] = useState('Aberto')
  const [supplement, setSupplement] = useState('')
  const [idCustomer, setIdCustomer] = useState(false)

  function handleOptionChange(e) {
    setStatus(e.target.value)
  }

  function handleChangeSelect(e) {
    setSubject(e.target.value)
  }

  function handleChangeCustomer(e) {
    setCustomerSelected(e.target.value)
  }

  async function handleRegister(e) {
    e.preventDefault()

    if (idCustomer) {
      const docRef = doc(db, 'tickets', id)

      await updateDoc(docRef, {
        customer: customers[customerSelected].nameCompany,
        customerId: customers[customerSelected].id,
        subject: subject,
        status: status,
        supplement: supplement,
        userId: user.uid,
      })
        .then(() => {
        toast.success('Chamado atualizado com sucesso! 😊')
        setCustomerSelected(0);
        setSupplement('')
        navigate('/dashboard')
      })
        .catch(() => {
          toast.error('ops erro ao atualizar esse chamado! 😥')
        })

      return;
    }

    await addDoc(collection(db, 'tickets'), {
      created: new Date(),
      customer: customers[customerSelected].nameCompany,
      customerId: customers[customerSelected].id,
      subject: subject,
      status: status,
      supplement: supplement,
      userId: user.uid,
    })
      .then(() => {
        toast.success('Chamado registrado! 😊')
        setCustomerSelected(0)
        setSupplement('')
    })
      .catch((error) => {
        console.log(error);
        toast.error('Erro ao fazer o registro! 😥')
      })
  }

  async function loadId(lista) {
    const docRef = doc(db, 'tickets', id)
    await getDoc(docRef)
      .then((snapshot) => {
        setSubject(snapshot.data().subject)
        setStatus(snapshot.data().status)
        setSupplement(snapshot.data().supplement)

        let index = lista.findIndex(item => item.id === snapshot.data().customerId)

        setCustomerSelected(index)
        setIdCustomer(true)

      })
      .catch((error) => {
        toast.error('Erro ao fazer o registro! 😥')
        setIdCustomer(false)
      })
  }

  useEffect(() => {
    async function loadCustomer() {
      const querySnapshot = await getDocs(listRef)
        .then((snapshot) => {

          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              nameCompany: doc.data().nameCompany,
            })
          })

         if (snapshot.docs.size === 0) {
            setCustomers([{
              id: 1,
              nameCompany: 'Freela',
            }])
            setLoadCustomer(false)
            return;
         } 
         
        setCustomers(lista)
        setLoadCustomer(false)

        if (id) {
          loadId(lista)
        }
        
      }) 
      .catch((error) => {
        console.log('Error: ', error);
        setLoadCustomer(false)
        setCustomers([{
          id: 1,
          nameCompany: 'Freela',
        }])
      })


    }

    loadCustomer();
  }, [id])

 return (
   <div>
    <Header />
    <div className="content">
      <Title name={id ? 'Editando chamado' : 'Novo chamado'}>
        <FiPlusCircle size={25} />
      </Title>

      <div className="container">
        <form className="form-profile" onSubmit={handleRegister} >

          <label>Clientes</label>
          {
            loadCustomer ? (
              <input type='text' value='Carregando...' />
            ) : (
              <select value={customerSelected} onChange={handleChangeCustomer} >
                {customers.map((item, index) => {
                  return (
                    <option key={index} value={index} >
                      {item.nameCompany}
                    </option>
                  )
                })}
              </select>
            )
          }

          <label>Assunto</label>
          <select value={subject} onChange={handleChangeSelect} >
            <option value='Suporte' >Suporte</option>
            <option value='Visita Tecnica'>Visita Tecnica</option>
            <option value='Financeiro' >Financeiro</option>
          </select>

          <label>Status</label>
          <div className="status">
            <input
              type="radio"
              name='radio'
              value='Aberto'
              onChange={handleOptionChange}
              checked={ status === 'Aberto' }
            />
            <span>Em aberto</span>
            <input
              type="radio"
              name='radio'
              value='Atendido'
              onChange={handleOptionChange}
              checked={ status === 'Atendido' }
            />
            <span>Atendido</span>
            <input
              type="radio"
              name='radio'
              value='Prograsso'
              onChange={handleOptionChange}
              checked={ status === 'Prograsso' }
            />
            <span>Em progresso</span>
          </div>

          <label>Complemento</label>

          <textarea
            type='text'
            placeholder='Descreva seu problema (opcional). '
            value={supplement}
            onChange={ (e) => setSupplement(e.target.value) }
          />

          <button type='submit'>Registrar</button>

        </form>
      </div>

    </div>
   </div>
 );
}