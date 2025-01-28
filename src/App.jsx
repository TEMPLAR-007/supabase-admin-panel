import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    discount_percentage: 0,
    show_discount: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // State to keep track of the current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loading, setLoading] = useState(false); // To handle loading state
  const pageSize = 10; // Number of products per page

  // Fetch products based on current page
  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    setLoading(true);
    const { data, error, count } = await supabase
      .from('products')
      .select('*', { count: 'exact' })
      .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data);
      setTotalPages(Math.ceil(count / pageSize)); // Calculate total pages
    }
    setLoading(false);
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: publicUrl } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };

  // Save product (Add or Update)
  const saveProduct = async () => {
    let imageUrl = '';
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      if (!imageUrl) {
        alert('Failed to upload image.');
        return;
      }
    }

    if (editingProduct) {
      const { error } = await supabase.from('products').update({
        ...newProduct,
        image: imageUrl || editingProduct.image,
      }).eq('id', editingProduct.id);

      if (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
      } else {
        setEditingProduct(null);
        setNewProduct({ name: '', description: '', price: '', image: '', discount_percentage: 0, show_discount: true });
        setImageFile(null);
        fetchProducts();
        alert('Product updated successfully!');
        setShowModal(false);
      }
    } else {
      const { error } = await supabase.from('products').insert([
        { ...newProduct, image: imageUrl },
      ]);

      if (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product.');
      } else {
        setNewProduct({ name: '', description: '', price: '', image: '', discount_percentage: 0, show_discount: true });
        setImageFile(null);
        fetchProducts();
        alert('Product added successfully!');
        setShowModal(false);
      }
    }
  };

  // Edit an existing product
  const editProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      discount_percentage: product.discount_percentage,
      show_discount: product.show_discount || true,
    });
    setShowModal(true);
  };

  // Delete a product
  const deleteProduct = async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    } else {
      fetchProducts();
      alert('Product deleted successfully!');
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const styles = {
    container: { fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '1200px', margin: 'auto' },
    header: { textAlign: 'center', marginBottom: '30px' },
    formContainer: { backgroundColor: '#f8f9fa', borderRadius: '8px', padding: '20px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' },
    formTitle: { fontSize: '24px', marginBottom: '20px', color: '#333' },
    inputField: { marginBottom: '15px', padding: '10px', width: '100%', border: '1px solid #ccc', borderRadius: '4px' },
    button: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px' },
    addButton: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', marginBottom: '20px' },
    productList: { marginTop: '30px' },
    productItem: { display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #ccc', marginBottom: '10px' },
    productImage: { width: '100px', height: 'auto', marginRight: '20px', borderRadius: '8px' },
    productInfo: { flex: 1 },
    productActions: { display: 'flex', gap: '10px' },
    editButton: { padding: '8px 12px', cursor: 'pointer', backgroundColor: '#ffc107', color: '#fff', border: 'none', borderRadius: '4px' },
    deleteButton: { padding: '8px 12px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '400px', position: 'relative' },
    closeModalButton: { position: 'absolute', top: '10px', right: '10px', backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' },
    redAccent: { color: 'red' },
    paginationContainer: { textAlign: 'center', marginTop: '20px' },
    paginationButton: { padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px' },
  };





  const navigate = useNavigate();

  // Log out functionality
  const logout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to login page after logout
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Panel</h1>

      <button onClick={logout} style={styles.button}>Logout</button>

      {/* Add Product Button */}
      <button
        onClick={() => {
          setShowModal(true);
          setEditingProduct(null);
          setNewProduct({
            name: '',
            description: '',
            price: '',
            image: '',
            discount_percentage: 0,
            show_discount: true,
          });
          setImageFile(null);
        }}
        style={styles.addButton}
      >
        Add Product
      </button>

      {/* Product List */}
      <div style={styles.productList}>
        <h2>Product List</h2>
        {products.map((product) => (
          <div key={product.id} style={styles.productItem}>
            <img src={product.image} alt={product.name} style={styles.productImage} />
            <div style={styles.productInfo}>
              <strong>{product.name}</strong> - ${product.price}
              <div>{product.description}</div>
              {product.show_discount && product.discount_percentage > 0 && (
                <div style={styles.redAccent}>
                  <strong>Discount: </strong>{product.discount_percentage}%
                  <div>
                    <strong>Discounted Price:</strong> ${(product.price - (product.price * (product.discount_percentage / 100))).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
            <div style={styles.productActions}>
              <button onClick={() => editProduct(product)} style={styles.editButton}>Edit</button>
              <button onClick={() => deleteProduct(product.id)} style={styles.deleteButton}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={styles.paginationContainer}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          style={styles.paginationButton}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          style={styles.paginationButton}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>

      {/* Modal for Adding / Editing Product */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setShowModal(false)}
              style={styles.closeModalButton}
            >
              Close
            </button>
            <h2 style={styles.formTitle}>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <input
              type="text"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              style={styles.inputField}
            />
            <textarea
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              style={styles.inputField}
            />
            <input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              style={styles.inputField}
            />
            <input
              type="number"
              placeholder="Discount Percentage"
              value={newProduct.discount_percentage}
              onChange={(e) => setNewProduct({ ...newProduct, discount_percentage: e.target.value })}
              style={styles.inputField}
            />
            <label style={{ display: 'block', marginBottom: '10px' }}>
              <input
                type="checkbox"
                checked={newProduct.show_discount}
                onChange={(e) => setNewProduct({ ...newProduct, show_discount: e.target.checked })}
              />
              Show Discount
            </label>
            <input
              type="file"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={styles.inputField}
            />
            <button onClick={saveProduct} style={styles.button}>
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
