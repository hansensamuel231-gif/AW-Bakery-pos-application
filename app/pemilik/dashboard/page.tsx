'use client';

import { useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function DashboardPage() {
  const { transactions, products } = useApp();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayTransactions = transactions.filter(
      (t) => new Date(t.date).toDateString() === today
    );

    const totalSalesToday = todayTransactions.reduce(
      (sum, t) => sum + t.total,
      0
    );

    // Find best selling product
    const productSales: { [key: string]: { name: string; count: number; revenue: number } } = {};
    transactions.forEach((t) => {
      t.items.forEach((item) => {
        if (!productSales[item.product.id]) {
          productSales[item.product.id] = {
            name: item.product.name,
            count: 0,
            revenue: 0,
          };
        }
        productSales[item.product.id].count += item.quantity;
        productSales[item.product.id].revenue +=
          item.product.price * item.quantity;
      });
    });

    const bestSelling = Object.values(productSales).sort(
      (a, b) => b.revenue - a.revenue
    )[0] || { name: 'N/A', count: 0, revenue: 0 };

    // Last 7 days sales
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const daySales = transactions
        .filter((t) => new Date(t.date).toDateString() === dateStr)
        .reduce((sum, t) => sum + t.total, 0);

      last7Days.push({
        date: date.toLocaleDateString('id-ID', {
          month: 'short',
          day: 'numeric',
        }),
        sales: daySales,
      });
    }

    return {
      totalSalesToday,
      totalTransactions: todayTransactions.length,
      bestSelling,
      last7Days,
      totalRevenue: transactions.reduce((sum, t) => sum + t.total, 0),
      allTimeTransactions: transactions.length,
    };
  }, [transactions]);

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard Pemilik</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Penjualan Hari Ini</p>
          <p className="text-3xl font-bold text-accent">
            Rp {stats.totalSalesToday.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.totalTransactions} transaksi
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Transaksi</p>
          <p className="text-3xl font-bold text-primary">
            {stats.allTimeTransactions}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Sepanjang masa
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Produk Terlaris</p>
          <p className="text-xl font-bold text-foreground">
            {stats.bestSelling.name}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {stats.bestSelling.count} unit terjual
          </p>
        </Card>

        <Card className="p-6 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Pendapatan</p>
          <p className="text-3xl font-bold text-secondary">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Semua waktu
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Penjualan 7 Hari Terakhir
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#8B6F47"
                name="Penjualan (Rp)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Stok Produk
          </h2>
          <div className="space-y-3">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <span className="text-sm text-foreground">{product.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-muted rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2"
                      style={{
                        width: `${Math.min(100, (product.stock / 30) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-muted-foreground w-8">
                    {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          10 Transaksi Terbaru
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  No. Transaksi
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Tanggal
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Jumlah Item
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Total
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Metode Pembayaran
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border hover:bg-background"
                >
                  <td className="py-3 px-2 font-semibold">{transaction.id}</td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {new Date(transaction.date).toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-2">
                    {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} item
                  </td>
                  <td className="py-3 px-2 font-semibold">
                    Rp {transaction.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-2 capitalize">
                    {transaction.paymentMethod === 'tunai'
                      ? 'Tunai'
                      : transaction.paymentMethod === 'debit'
                      ? 'Debit'
                      : 'QRIS'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
