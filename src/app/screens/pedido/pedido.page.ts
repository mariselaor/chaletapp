import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';
import { Pedido } from 'src/app/models/pedido.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.page.html',
  styleUrls: ['./pedido.page.scss'],
})
export class PedidoPage implements OnInit {
  pedidos: Pedido[] = [];

  constructor(
    private pedidoService: PedidoService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.loadPedidos();
  }

  loadPedidos() {
    this.pedidoService.getOrders().subscribe(
      (pedidos) => {
        console.log('Pedidos cargados:', pedidos);
        this.pedidos = pedidos;
      },
      (error) => {
        console.error('Error al cargar los pedidos:', error);
      }
    );
  }

  async deleteOrder(pedido: Pedido) {
    try {
      await this.pedidoService.deleteOrder(pedido.id);
      console.log('Pedido eliminado:', pedido.id);
      // Actualizar la lista de pedidos después de eliminar
      this.loadPedidos();
    } catch (error) {
      console.error('Error al eliminar el pedido:', error);
    }
  }
  async updateOrderStatus(pedido: Pedido, newStatus: string) {
    try {
      await this.pedidoService.updateOrderStatus(pedido.id, newStatus);
      console.log('Estado del pedido actualizado:', pedido.id);
      // Actualizar la lista de pedidos después de actualizar el estado
      this.loadPedidos();
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
    }
  }
}
