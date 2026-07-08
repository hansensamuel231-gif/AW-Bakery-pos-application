'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/app-context';
import { useAuth } from '@/lib/auth-context';
import { Product, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Minus, Trash2, Printer } from 'lucide-react';

export default function KasirPage() {
  const { products, cart, addToCart, updateCartQuantity, removeFromCart, clearCart, addTransaction } = useApp();
  const { user } = useAuth();
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [paymentMethod, setPaymentMethod] = useState<'tunai' | 'debit' | 'qris'>('tunai');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
    if (product.stock >= quantity) {
      addToCart(product, quantity);
      setQuantities((prev) => ({ ...prev, [product.id]: 1 }));
    }
  };

  const handleCompleteTransaction = () => {
    if (cart.length === 0) {
      alert('Keranjang belanja kosong');
      return;
    }

    const transaction: Transaction = {
      id: 'TRX' + Date.now().toString().slice(-6),
      date: new Date().toISOString(),
      items: cart,
      total: cartTotal,
      paymentMethod,
      kasirId: user?.id || 'kasir1',
    };

    addTransaction(transaction);
    setLastTransaction(transaction);
    setShowReceipt(true);
    clearCart();
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    setShowReceipt(false);
    setLastTransaction(null);
  };

  if (showReceipt && lastTransaction) {
    return (
      <div className="min-h-screen bg-background p-8 print:p-0">
        <div className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-8 print:shadow-none print:rounded-none print:p-4">
          <div className="text-center mb-6 print:mb-4">
            <h1 className="text-2xl font-bold text-primary print:text-lg">AW Bakery</h1>
            <p className="text-sm text-muted-foreground">Kuitansi Penjualan</p>
          </div>

          <div className="border-t-2 border-border pt-4 pb-4 print:pt-2 print:pb-2">
            <p className="text-sm text-muted-foreground">
              No. Transaksi: {lastTransaction.id}
            </p>
            <p className="text-sm text-muted-foreground">
              Tanggal: {new Date(lastTransaction.date).toLocaleString('id-ID')}
            </p>
            <p className="text-sm text-muted-foreground">
              Kasir: {user?.name}
            </p>
          </div>

          <div className="border-t border-border pt-4 pb-4 print:pt-2 print:pb-2">
            {lastTransaction.items.map((item) => (
              <div key={item.product.id} className="flex justify-between mb-2 text-sm print:text-xs">
                <span>{item.product.name}</span>
                <span className="text-muted-foreground">{item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}</span>
              </div>
            ))}
          </div>

          <div className="border-t-2 border-border pt-4 pb-4 print:pt-2 print:pb-2">
            <div className="flex justify-between font-bold text-lg print:text-base">
              <span>Total:</span>
              <span>Rp {cartTotal.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-sm mt-2 print:mt-1 text-muted-foreground">
              <span>Metode Pembayaran:</span>
              <span className="capitalize">
                {paymentMethod === 'tunai' ? 'Tunai' : paymentMethod === 'debit' ? 'Kartu Debit' : 'QRIS'}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground mt-4 print:mt-2">
            <p>Terima kasih atas pembelian Anda!</p>
            <p className="mt-2 print:mt-1">Selamat datang kembali</p>
          </div>

          <div className="flex gap-2 mt-6 print:hidden">
            <Button
              onClick={handlePrintReceipt}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              <Printer className="w-4 h-4 mr-2" />
              Cetak
            </Button>
            <Button
              onClick={handleNewTransaction}
              variant="outline"
              className="flex-1"
            >
              Transaksi Baru
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Products Section */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sistem Penjualan (POS)</h2>
          <Input
            placeholder="Cari produk..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-5 hover:shadow-xl transition-shadow bg-card border-border flex flex-col"
              >
                <div className="relative bg-muted rounded-lg h-56 mb-4 flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold text-primary mb-2">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className={`text-sm mb-4 font-medium ${
                  product.stock > 0 ? 'text-green-700' : 'text-destructive'
                }`}>
                  Stok: {product.stock}
                </p>
                <div className="flex items-center gap-2 mb-3 mt-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, (prev[product.id] || 1) - 1),
                      }))
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    value={quantities[product.id] || 1}
                    onChange={(e) =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: Math.max(1, parseInt(e.target.value) || 1),
                      }))
                    }
                    className="w-14 h-9 text-center text-base"
                    min="1"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setQuantities((prev) => ({
                        ...prev,
                        [product.id]: (prev[product.id] || 1) + 1,
                      }))
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 text-base"
                >
                  Tambah ke Keranjang
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-96 bg-card border-l border-border flex flex-col">
        <div className="p-6 border-b border-border bg-primary">
          <h3 className="text-2xl font-bold text-primary-foreground">Keranjang Belanja</h3>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {cart.length === 0 ? (
            <p className="text-muted-foreground text-center py-8 text-base">
              Keranjang kosong
            </p>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <Card key={item.product.id} className="p-4 bg-muted border-border">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-base text-foreground flex-1">
                      {item.product.name}
                    </h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-destructive hover:text-destructive/90 h-7 w-7 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-base font-bold w-10 text-center text-foreground">
                      {item.quantity}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.quantity + 1)
                      }
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-base font-semibold text-foreground">
                    Rp{' '}
                    {(
                      item.product.price * item.quantity
                    ).toLocaleString('id-ID')}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-5 space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between mb-3">
              <span className="text-base text-muted-foreground">Subtotal:</span>
              <span className="font-bold text-foreground text-base">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="border-t border-border pt-3 mt-3 flex justify-between">
              <span className="font-bold text-foreground text-lg">Total:</span>
              <span className="font-bold text-2xl text-primary">
                Rp {cartTotal.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-base font-semibold text-foreground mb-2">
              Metode Pembayaran
            </label>
            <Select
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as 'tunai' | 'debit' | 'qris')
              }
            >
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tunai">Tunai</SelectItem>
                <SelectItem value="debit">Kartu Debit</SelectItem>
                <SelectItem value="qris">QRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleCompleteTransaction}
            disabled={cart.length === 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 text-lg"
          >
            Selesaikan Transaksi
          </Button>

          {cart.length > 0 && (
            <Button
              onClick={() => clearCart()}
              variant="outline"
              className="w-full"
            >
              Bersihkan Keranjang
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
