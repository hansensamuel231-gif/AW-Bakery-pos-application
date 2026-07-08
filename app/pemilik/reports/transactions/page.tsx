'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';

export default function TransactionReportsPage() {
  const { transactions } = useApp();
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (!fromDate && !toDate) return true;

      const transactionDate = new Date(t.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      if (from && transactionDate < from) return false;
      if (to) {
        const toEnd = new Date(to);
        toEnd.setDate(toEnd.getDate() + 1);
        if (transactionDate >= toEnd) return false;
      }

      return true;
    });
  }, [transactions, fromDate, toDate]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalRevenue = filteredTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalItems = filteredTransactions.reduce(
    (sum, t) => sum + t.items.reduce((s, item) => s + item.quantity, 0),
    0
  );

  const handleExport = () => {
    const csv = [
      ['No. Transaksi', 'Tanggal', 'Produk', 'Jumlah', 'Total', 'Metode Pembayaran'],
      ...filteredTransactions.map((t) => [
        t.id,
        new Date(t.date).toLocaleString('id-ID'),
        t.items.map((i) => i.product.name).join(', '),
        t.items.reduce((sum, i) => sum + i.quantity, 0),
        t.total,
        t.paymentMethod === 'tunai'
          ? 'Tunai'
          : t.paymentMethod === 'debit'
          ? 'Debit'
          : 'QRIS',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `laporan-transaksi-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Laporan Transaksi</h1>

      {/* Filters */}
      <Card className="p-6 bg-card border-border mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Dari Tanggal
            </label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Sampai Tanggal
            </label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={() => {
                setFromDate('');
                setToDate('');
                setCurrentPage(1);
              }}
              variant="outline"
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              onClick={handleExport}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <Download className="w-4 h-4 mr-2" />
              Ekspor CSV
            </Button>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Transaksi</p>
          <p className="text-2xl font-bold text-foreground">
            {filteredTransactions.length}
          </p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Item Terjual</p>
          <p className="text-2xl font-bold text-foreground">{totalItems}</p>
        </Card>
        <Card className="p-4 bg-card border-border">
          <p className="text-sm text-muted-foreground mb-2">Total Pendapatan</p>
          <p className="text-2xl font-bold text-accent">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </p>
        </Card>
      </div>

      {/* Table */}
      <Card className="p-6 bg-card border-border">
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
                  Produk
                </th>
                <th className="text-left py-3 px-2 text-muted-foreground font-semibold">
                  Jumlah
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
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Tidak ada transaksi yang ditemukan
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-border hover:bg-background"
                  >
                    <td className="py-3 px-2 font-semibold">{transaction.id}</td>
                    <td className="py-3 px-2 text-muted-foreground">
                      {new Date(transaction.date).toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-2 text-xs">
                      <div className="space-y-1">
                        {transaction.items.map((item) => (
                          <div key={item.product.id}>
                            {item.product.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {transaction.items.reduce((sum, item) => sum + item.quantity, 0)}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Halaman {currentPage} dari {totalPages}
            </p>
            <div className="space-x-2">
              <Button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Sebelumnya
              </Button>
              <Button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Selanjutnya
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
