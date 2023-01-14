import { useEffect, useState } from 'react'

// import {AuthContext} from '../../contexts/auth'
import { Link } from 'react-router-dom'
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2, FiX } from 'react-icons/fi'

import Header from '../../components/Header'
import Title from '../../components/Title'
import Modal from '../../components/Modal'

import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import './dashboard.css'

import { format } from 'date-fns'

const listRef = collection(db, 'tickets')

export default function Dashboard(){
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)

  const [isEmpty, setIsEmpty] = useState(false)

  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false)

  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState()



  useEffect(() => {
    async function loadingTickets() {
      const queryTickets = query(listRef, orderBy('created', 'desc'), limit(5))

      const querySnapshot = await getDocs(queryTickets)
      setTickets([]);

      await updateState(querySnapshot)

      setLoading(false)
    }

    loadingTickets()

    return () => {}
  }, [])

  async function updateState(querySnapshot) {
    console.log(querySnapshot);
    const isCollectionEmpty = querySnapshot.size === 0

    if (!isCollectionEmpty) {
      
      let lista = [];

      querySnapshot.forEach((doc) => {

            lista.push({
              id: doc.id,
              subject: doc.data().subject,
              customer: doc.data().customer,
              customerId: doc.data().customerId,
              created: doc.data().created,
              createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
              status: doc.data().status,
              supplement: doc.data().supplement,
            })
          })     
      
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length -1]

      setTickets(tickets => [...tickets, ...lista]);
      setLastDocs(lastDoc);

    } else {
      setIsEmpty(true);
    }

    setLoadingMore(false);

  }

  async function handleMore(e) {
    setLoadingMore(true);
    const queryTickets = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))

    const querySnapshot = await getDocs(queryTickets)

    await updateState(querySnapshot) 
  }

  function toggleModal(item) {
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  if(loading){
    return(
      <div>
        <Header/>

        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>

          <div className="container dashboard">
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>

      <div className="content">
        <Title name='Tickets' >
          <FiMessageSquare size={25}  />
        </Title>

        <>
          {
            tickets.length === 0 ? (
              <div className='container dashboard' >
                <span>Nenhum chamado encontrado...</span>
                <Link to='/new' className='new'>
                  <FiPlus color='#FFF' size={25} />
                  Novo chamado
                </Link>
              </div>
            ) : (
              <>
                <Link to='/new' className='new'>
                  <FiPlus color='#FFF' size={25} />
                  Novo chamado
                </Link>
                <table>
                  <thead>
                    <tr>
                      <th scope='col'>Cliente</th>
                      <th scope='col'>Assunto</th>
                      <th scope='col'>Status</th>
                      <th scope='col'>Cadastrado em</th>
                      <th scope='col'>#</th>
                    </tr>
                  </thead> 
                  <tbody>
                    { tickets.map((item, index) => {
                      return (
                        <tr key={index} >
                          <td data-label='Cliente' >{item.customer}</td>
                          <td data-label='Assunto' >{item.subject}</td>
                          <td data-label='Status' >
                            <span className='badge' style={{ backgroundColor: item.status === 'Aberto' ? '#5CB85C' : '#999' }} >
                              {item.status}
                            </span>
                          </td>
                          <td data-label='Cadastrado' >{item.createdFormat}</td>
                          <td data-label='#' >
                            <button className="action" style={{ backgroundColor: '#3586F3' }} onClick={ () => toggleModal(item) } >
                              <FiSearch color='#FFF' size={17} />
                            </button>
                            <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#F6A935' }} >
                              <FiEdit2 color='#FFF' size={17} />
                            </Link>
                            {/* <button className="action" style={{ backgroundColor: '#FC451B' }} >
                              <FiX color='#FFF' size={17} />
                            </button> */}
                          </td>         
                        </tr>
                      )
                    }) }
                  </tbody>          
                </table>

                {loadingMore && <h3>Buscando mais chamados....</h3>}
                {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore} >Buscar mais</button>}
              </>
            )
          }
        </>

      </div>

      {
        showPostModal && (
          <Modal 
          content={detail}
          close={() => setShowPostModal(!showPostModal)}
          />
        )
      }
    </div>
  )
}