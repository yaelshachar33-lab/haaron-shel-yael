import { useState, useEffect } from 'react'
import { db } from '../firebase'
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, query
} from 'firebase/firestore'
import { products as defaultProducts } from '../data/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('dateAdded', 'desc'))
        const snap = await getDocs(q)
        if (snap.empty) {
          const seeded = await Promise.all(
            defaultProducts.map(({ id: _id, ...p }) =>
              addDoc(collection(db, 'products'), p).then(ref => ({ id: ref.id, ...p }))
            )
          )
          setProducts(seeded)
        } else {
          setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })))
        }
      } catch (e) {
        console.error(e)
        setProducts(defaultProducts)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const addProduct = async (data) => {
    const product = { ...data, dateAdded: new Date().toISOString().split('T')[0] }
    const docRef = await addDoc(collection(db, 'products'), product)
    setProducts(prev => [{ id: docRef.id, ...product }, ...prev])
  }

  const updateProduct = async (id, data) => {
    await updateDoc(doc(db, 'products', String(id)), data)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  const deleteProduct = async (id) => {
    await deleteDoc(doc(db, 'products', String(id)))
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  return { products, loading, addProduct, updateProduct, deleteProduct }
}
