import { useEffect, useMemo, useState } from 'react';
import { api } from './api';

const screens = [
  { id: 'products', label: 'Product Assistant' },
  { id: 'inventory', label: 'Inventory Assistant' },
  { id: 'insights', label: 'Business Insights' },
];

function formatCurrency(value) {
  return `INR ${Number(value || 0).toLocaleString('en-IN')}`;
}

function StatCard({ label, value }) {
  return <div className="stat-card"><span>{label}</span><strong>{value}</strong></div>;
}

function Header({ activeScreen, onChange, lowStockCount }) {
  return <>
    <header className="hero">
      <div><p>Smart POS</p><h1>AI Operations Console</h1></div>
      <span>{lowStockCount} products need attention</span>
    </header>
    <nav className="screen-nav" aria-label="Main navigation">
      {screens.map((screen) => <button key={screen.id} className={activeScreen === screen.id ? 'active' : ''} onClick={() => onChange(screen.id)}>{screen.label}</button>)}
    </nav>
  </>;
}

function ProductAssistant({ products, onProductAdded }) {
  const [form, setForm] = useState({ name: '', price: '', stock: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [created, setCreated] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const result = await api.addProduct({ name: form.name, price: Number(form.price), stock: Number(form.stock) });
      setCreated(result.product);
      setMessage(result.message);
      setForm({ name: '', price: '', stock: '' });
      await onProductAdded();
    } catch (error) {
      setMessage(error.message);
    } finally { setLoading(false); }
  };

  return <div className="screen-layout">
    <section className="panel">
      <div className="panel-heading"><p>Create product</p><h2>AI Assisted Product Listing</h2></div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>Product name<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Wireless mouse" required /></label>
        <label>Price<input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="799" required /></label>
        <label>Opening stock<input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="25" required /></label>
        <button disabled={loading}>{loading ? 'Generating...' : 'Add product'}</button>
      </form>
      {message && <p className="message">{message}</p>}
      {created && <div className="result-card">
        <h3>{created.name}</h3><p>{created.description}</p>
        <dl className="detail-grid">
          <div><dt>Category</dt><dd>{created.category || 'General'}</dd></div>
          <div><dt>GST</dt><dd>{created.gstRate ?? '-'}%</dd></div>
          <div><dt>HSN</dt><dd>{created.hsnCode || '-'}</dd></div>
        </dl>
        <div className="chip-row">{(created.tags || []).map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>}
    </section>
    <Catalog products={products} />
  </div>;
}

function Catalog({ products }) {
  return <section className="panel wide-card">
    <div className="panel-heading"><p>Catalog</p><h2>Current Products</h2></div>
    <div className="desktop-table"><table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>GST</th><th>HSN</th><th>Tags</th></tr></thead><tbody>
      {products.map((product) => <tr key={product._id}><td>{product.name}</td><td>{product.category || 'General'}</td><td>{formatCurrency(product.price)}</td><td>{product.stock}</td><td>{product.gstRate ?? '-'}%</td><td>{product.hsnCode || '-'}</td><td>{(product.tags || []).join(', ')}</td></tr>)}
    </tbody></table></div>
    <div className="mobile-cards">{products.map((product) => <article className="catalog-card" key={product._id}><h3>{product.name}</h3><p>{product.category || 'General'}</p><dl><div><dt>Price</dt><dd>{formatCurrency(product.price)}</dd></div><div><dt>Stock</dt><dd>{product.stock}</dd></div><div><dt>GST</dt><dd>{product.gstRate ?? '-'}%</dd></div><div><dt>HSN</dt><dd>{product.hsnCode || '-'}</dd></div></dl></article>)}</div>
  </section>;
}

function InventoryAssistant({ products, onInventoryUpdated }) {
  const [command, setCommand] = useState('Decrease Laptop inventory from 50 to 10');
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('');
    try { const data = await api.updateInventory(command); setResult(data); setMessage(data.message); await onInventoryUpdated(); }
    catch (error) { setMessage(error.message); setResult(null); }
    finally { setLoading(false); }
  };

  return <div className="screen-layout">
    <section className="panel">
      <div className="panel-heading"><p>Inventory command</p><h2>Update Stock with Text</h2></div>
      <form onSubmit={handleSubmit} className="command-form"><textarea value={command} onChange={(e) => setCommand(e.target.value)} rows="4" /><button disabled={loading}>{loading ? 'Processing...' : 'Run command'}</button></form>
      <div className="examples"><span>Try:</span><button onClick={() => setCommand('Increase mobile stock by 5')}>Increase mobile stock by 5</button><button onClick={() => setCommand('Set iphone inventory to 25')}>Set iphone inventory to 25</button></div>
      {message && <p className="message">{message}</p>}
      {result && <div className="json-block"><pre>{JSON.stringify(result.aiAnalysis, null, 2)}</pre></div>}
    </section>
    <section className="panel wide-card"><div className="panel-heading"><p>Live stock</p><h2>Current Inventory</h2></div><div className="stock-list">{products.map((product) => <div key={product._id}><span>{product.name}</span><strong>{product.stock}</strong></div>)}</div></section>
  </div>;
}

function SaleRecorder({ products, onSaleRecorded }) {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!productId && products[0]?._id) setProductId(products[0]._id); }, [products, productId]);

  const handleSubmit = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('');
    try { const result = await api.recordSale({ productId, quantity: Number(quantity) }); setMessage(result.message); await onSaleRecorded(); }
    catch (error) { setMessage(error.message); }
    finally { setLoading(false); }
  };

  return <section className="panel">
    <div className="panel-heading"><p>Sales entry</p><h2>Record a Sale</h2></div>
    <form className="form-grid" onSubmit={handleSubmit}>
      <label>Product<select value={productId} onChange={(e) => setProductId(e.target.value)} required>{products.map((product) => <option key={product._id} value={product._id}>{product.name} - {product.stock} in stock</option>)}</select></label>
      <label>Quantity sold<input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /></label>
      <button disabled={loading}>{loading ? 'Recording...' : 'Record sale'}</button>
    </form>
    {message && <p className="message">{message}</p>}
  </section>;
}

function InsightsDashboard({ insights, products, onSaleRecorded }) {
  if (!insights) return null;
  const data = insights.businessInsights;
  return <div className="screen-layout insights-screen">
    <SaleRecorder products={products} onSaleRecorded={onSaleRecorded} />
    <section className="panel wide-card"><div className="panel-heading"><p>Overview</p><h2>Business Dashboard</h2></div><div className="stats-grid"><StatCard label="Total Products" value={data.totalProducts} /><StatCard label="Total Stock" value={data.totalStock} /><StatCard label="Inventory Value" value={formatCurrency(data.totalInventoryValue)} /><StatCard label="Inventory Health" value={data.inventoryHealth} /></div></section>
    <section className="panel"><div className="panel-heading"><p>Sales</p><h2>Top-Selling Products</h2></div>{data.topSellingProducts?.length ? <ul className="clean-list">{data.topSellingProducts.map((item) => <li key={item.name}>{item.name} - {item.unitsSold} units sold</li>)}</ul> : <p>No sales recorded yet.</p>}</section>
    <section className="panel"><div className="panel-heading"><p>Recommendations</p><h2>AI Suggestions</h2></div><p>{data.recommendations?.summary}</p><ul className="clean-list">{(data.recommendations?.recommendations || []).map((item) => <li key={item}>{item}</li>)}</ul></section>
    <section className="panel wide-card"><div className="insight-columns"><div><h3>Low Stock Products</h3>{data.lowStockProducts.length === 0 ? <p>No low-stock products.</p> : <ul className="clean-list">{data.lowStockProducts.map((item) => <li key={`${item.name}-${item.stock}`}>{item.name} - {item.stock} left ({item.priority})</li>)}</ul>}</div><div><h3>Product Performance</h3><ul className="clean-list">{(data.productPerformance || []).map((item) => <li key={`${item.name}-${item.stock}`}>{item.name}: {item.unitsSold} sold, {item.stock} in stock - {item.status}</li>)}</ul></div></div></section>
  </div>;
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState('products');
  const [products, setProducts] = useState([]);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState('');

  const loadData = async () => {
    try { setError(''); const [productsData, insightsData] = await Promise.all([api.getProducts(), api.getInsights()]); setProducts(productsData); setInsights(insightsData); }
    catch (err) { setError(err.message); }
  };

  useEffect(() => { loadData(); }, []);
  const lowStockCount = useMemo(() => insights?.businessInsights?.lowStockCount || 0, [insights]);

  return <main>
    <Header activeScreen={activeScreen} onChange={setActiveScreen} lowStockCount={lowStockCount} />
    {error && <p className="error-banner">{error}</p>}
    {activeScreen === 'products' && <ProductAssistant products={products} onProductAdded={loadData} />}
    {activeScreen === 'inventory' && <InventoryAssistant products={products} onInventoryUpdated={loadData} />}
    {activeScreen === 'insights' && <InsightsDashboard insights={insights} products={products} onSaleRecorded={loadData} />}
  </main>;
}
