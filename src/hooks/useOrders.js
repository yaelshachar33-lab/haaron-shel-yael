import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, getDocs, addDoc, updateDoc, doc, orderBy, query } from 'firebase/firestore'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'))
        const snap = await getDocs(q)
        setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const addOrder = async (data) => {
    const order = { ...data, orderDate: new Date().toISOString(), status: 'הוזמן' }
    const ref = await addDoc(collection(db, 'orders'), order)
    setOrders(prev => [{ id: ref.id, ...order }, ...prev])
  }

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status })
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  return { orders, loading, addOrder, updateStatus }
}
