import { useState } from 'react';
import Header from '../../components/Header'
import Title from '../../components/Title'

import { FiUser } from 'react-icons/fi'
import { toast } from 'react-toastify';
import { db  } from '../../services/firebaseConnection';
import { addDoc, collection } from 'firebase/firestore'

export default function Customers() {
  const [nameCompany, setNameCompany] = useState('')
  const [cnpj, setCnpj] = useState('')
  const [address, setAddress] = useState('')

  async function handleRegister(e) {
    e.preventDefault()

    if (nameCompany !== '' && cnpj !== '' && address !== '') {
        await addDoc(collection(db, 'customers'), {
          nameCompany: nameCompany,
          cnpj: cnpj,
          address: address,
        })
          .then(() => {  
          setNameCompany('')
          setCnpj('')
          setAddress('')
          toast.success('Empresa registrada! 😊')
        })
          .catch((error) => {
          console.log(error);
          toast.error('Erro aoo fazer o registro! 😥')

        })

    } else {
      toast.error('Preencha todos os campos! 😊')
    }
    
  }

 return (
   <div>
    <Header />
    <div className='content'>
      <Title name="Clientes" >
        <FiUser size={25} />
      </Title>
      <div className="container">
        <form className="form-profile" onSubmit={handleRegister} >
          <label>Nome fantasia</label>
          <input
            type='text'
            placeholder='Digite o Nome da empresa'
            value={nameCompany}
            onChange={(e) => setNameCompany(e.target.value)}
            />
          <label>CNPJ</label>
          <input
            type='text'
            placeholder='Digite o CNPJ'
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            />
          <label>Endereço</label>
          <input
            type='text'
            placeholder='Digite o endereço da empresa'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            />
          <button type='submit'>
            Cadastrar
          </button>
        </form>
      </div>
    </div>    

   </div>
 );
}