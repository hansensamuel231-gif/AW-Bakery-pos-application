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
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-10">Dashboard Pemilik</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="p-8 bg-muted border-border shadow-md">
          <p className="text-base font-semibold text-muted-foreground mb-3">Penjualan Hari Ini</p>
          <p className="text-4xl font-bold text-primary">
            Rp {stats.totalSalesToday.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            {stats.totalTransactions} transaksi
          </p>
        </Card>

        <Card className="p-8 bg-muted border-border shadow-md">
          <p className="text-base font-semibold text-muted-foreground mb-3">Total Transaksi</p>
          <p className="text-4xl font-bold text-primary">
            {stats.allTimeTransactions}
          </p>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            Sepanjang masa
          </p>
        </Card>

        <Card className="p-8 bg-muted border-border shadow-md">
          <p className="text-base font-semibold text-muted-foreground mb-3">Produk Terlaris</p>
          <p className="text-2xl font-bold text-foreground">
            {stats.bestSelling.name}
          </p>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            {stats.bestSelling.count} unit terjual
          </p>
        </Card>

        <Card className="p-8 bg-muted border-border shadow-md">
          <p className="text-base font-semibold text-muted-foreground mb-3">Total Pendapatan</p>
          <p className="text-4xl font-bold text-primary">
            Rp {stats.totalRevenue.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-muted-foreground mt-3 font-medium">
            Semua waktu
          </p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <Card className="p-8 bg-muted border-border shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">
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
                stroke="#FF8C42"
                name="Penjualan (Rp)"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-8 bg-muted border-border shadow-md">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Stok Produk
          </h2>
          <div className="space-y-4">
            {products.slice(0, 5).map((product) => (
              <div key={product.id} className="flex justify-between items-center">
                <span className="text-base font-medium text-foreground">{product.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-border rounded-full h-3">
                    <div
                      className="bg-primary rounded-full h-3"
                      style={{
                        width: `${Math.min(100, (product.stock / 30) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-base font-bold text-foreground w-8">
                    {product.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-8 bg-muted border-border shadow-md">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          10 Transaksi Terbaru
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b-2 border-border bg-background">
                <th className="text-left py-4 px-3 text-foreground font-bold">
                  No. Transaksi
                </th>
                <th className="text-left py-4 px-3 text-foreground font-bold">
                  Tanggal
                </th>
                <th className="text-left py-4 px-3 text-foreground font-bold">
                  Jumlah Item
                </th>
                <th className="text-left py-4 px-3 text-foreground font-bold">
                  Total
                </th>
                <th className="text-left py-4 px-3 text-foreground font-bold">
                  Metode Pembayaran
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.slice(0, 10).map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b border-border hover:bg-background transition-colors"
                >
                  <td className="py-4 px-3 font-semibold text-foreground">{transaction.id}</td>
                  <td className="py-4 px-3 text-foreground">
                    {new Date(transaction.date).toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-3 text-foreground">
                    {transaction.items.reduce((sum, item) => sum + item.quantity, 0)} item
                  </td>
                  <td className="py-4 px-3 font-bold text-primary">
                    Rp {transaction.total.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-3 text-foreground">
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
