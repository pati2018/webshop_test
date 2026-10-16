import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
  query,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Product, Order } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';

/**
 * Initializes and listens to the products collection in Firestore.
 * Automatically seeds the 3 default products if the collection is empty.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const colRef = collection(db, PRODUCTS_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    async (snapshot) => {
      const alreadySeeded = localStorage.getItem('kontur_store_seeded') === 'true';

      if (snapshot.empty && !alreadySeeded) {
        // Seed initial products to Firestore only once
        try {
          for (const prod of INITIAL_PRODUCTS) {
            await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
          }
          localStorage.setItem('kontur_store_seeded', 'true');
        } catch (seedErr) {
          handleFirestoreError(seedErr, OperationType.WRITE, PRODUCTS_COLLECTION);
        }
        return;
      }

      const list: Product[] = [];
      snapshot.forEach((d) => {
        const prod = d.data() as Product;
        // Ignore soft-deleted products
        if (!prod.isDeleted) {
          list.push(prod);
        }
      });
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Listens to orders collection in real-time.
 */
export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: unknown) => void
): () => void {
  const colRef = collection(db, ORDERS_COLLECTION);

  const unsubscribe = onSnapshot(
    colRef,
    (snapshot) => {
      const list: Order[] = [];
      snapshot.forEach((d) => {
        list.push(d.data() as Order);
      });
      // Sort newest first
      list.sort((a, b) => (b.date > a.date ? 1 : -1));
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
}

/**
 * Saves or updates a product in Firestore.
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${product.id}`;
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    await setDoc(docRef, product, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Deletes a product from Firestore.
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${PRODUCTS_COLLECTION}/${productId}`;
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  try {
    await deleteDoc(docRef);
  } catch (deleteError) {
    console.warn('Direct deleteDoc failed, applying soft-delete flag in Firestore:', deleteError);
    try {
      await updateDoc(docRef, { isDeleted: true });
    } catch (updateError) {
      handleFirestoreError(updateError, OperationType.DELETE, path);
    }
  }
}

/**
 * Saves a new order into Firestore upon PayPal payment.
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  // Normalize ID for Firestore doc ID (strip '#' or special chars)
  const cleanId = order.id.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `${ORDERS_COLLECTION}/${cleanId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, cleanId);
    await setDoc(docRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Updates status of an existing order in Firestore.
 */
export async function updateOrderStatusInFirestore(orderId: string, status: Order['status']): Promise<void> {
  const cleanId = orderId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const path = `${ORDERS_COLLECTION}/${cleanId}`;
  try {
    const docRef = doc(db, ORDERS_COLLECTION, cleanId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Resets Firestore catalog back to initial 3 products.
 */
export async function resetProductsToFirestore(): Promise<void> {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const snap = await getDocs(colRef);
    for (const d of snap.docs) {
      await deleteDoc(d.ref);
    }
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, PRODUCTS_COLLECTION);
  }
}
