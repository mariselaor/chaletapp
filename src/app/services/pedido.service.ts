import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import firebase from 'firebase/compat/app';
import autoTable from 'jspdf-autotable';
import jsPDF from 'jspdf';
import { CartItem } from '../models/cart-item.model';


@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private firestore: AngularFirestore) { }

  async registerOrder(orderDetails: Omit<Pedido, 'id'>): Promise<any> {
    const id = this.firestore.createId(); // Generar un nuevo ID
    return await this.firestore.collection('pedidos').doc(id).set({...orderDetails, id});
  }

  getOrders(): Observable<Pedido[]> {
    return this.firestore.collection<Pedido>('pedidos').valueChanges();
  }

  deleteOrder(orderId: string): Promise<void> {
    return this.firestore.collection('pedidos').doc(orderId).delete();
  }

  // Método para actualizar el estado de un pedido
  updateOrderStatus(orderId: string, newStatus: string): Promise<void> {
    return this.firestore.collection('pedidos').doc(orderId).update({ estado: newStatus });
  }
  // Método para generar un PDF del ticket de compra
  generatePdf(cartItems: CartItem[], total: number) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 297] 
    });
    
    doc.setFontSize(12);
    doc.text('Ticket de Compra', 14, 10);

    const tableData = cartItems.map(item => [item.name, item.quantity, `$${item.price.toFixed(2)}`]);
    const tableColumnStyles: { [key: string]: Partial<any> } = {
      0: { halign: 'left' }, 
      2: { halign: 'right' }
    };
    const tableHead = [['Producto', 'Cantidad', 'Precio']];
    const tableBody = tableData;

    autoTable(doc, {
      head: tableHead,
      body: tableBody,
      startY: 20,
      theme: 'plain',
      headStyles: {
        fillColor: [0, 57, 107],
        textColor: [255, 255, 255],
        halign: 'center',
      },
      styles: {
        fontSize: 10,
        halign: 'center',
        cellPadding: 2,
      },
      columnStyles: tableColumnStyles,
      tableWidth: 'auto', 
      didDrawPage: (data) => {
        doc.setFontSize(12);
        doc.text(`Total: $${total.toFixed(2)}`, 14, data.cursor.y + 10);
      }
    });

    doc.save('ticket_compra.pdf');
  }
  
}
