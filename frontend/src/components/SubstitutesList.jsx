import {useEffect , useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

export default function SubstituteList({ medicineId}) {
  const [data, setData] = useState(null);
  const { addToCart } =useContext(CartContext);
  const { user} = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/medicines/${medicineId}/substitutes`)
    .then(res => setData(res.data))
    .catch(() => setData(null));

  }, [medicineId]);

  const add = (s) => {
    if(!user) { navigate('/login'); return; }
    addToCart({
      inventoryId: `${s.inventoryId}-unit`, medicineId:s.medicineId,medicineName: s.name,
      storeId: s.storeId, storeName:s.storeName, price: s.price, stock: s.stock,
      imageUrl: s.imageUrl, prescriptionRequired: s.prescriptionRequired
    }, 1);
  };
  if (!data || data.substitutes.length === 0) return null;

  return (
    <div className={`bg-white rounded-2xl mt-6 p-6 border-2 ${data.outOfStock ? 'border-rose-400' : 'border-slate-200'}`}>
      <h3 className="text-lg font-bold mb-2">
        {data.outOfStock ? 'Out of Stock! Buy these substitutes' : ' Cheaper substitutes (same salt)'}
    </h3>
    <p className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-4">
      These medicines have the same active ingredients in the same dosage.Ask your doctor before changing a medicine.
    </p>
    {data.substitutes.map(s => (
      <div key={s.inventoryId} className="flex justify-between items-center border-b py-3">
        <div>
          <p className="font-bold">{s.name}</p> 
          <p className="text-xs text-slate-500">{s.manufacturer} | {s.storeName}</p>
          </div>
          <div className="flex items-center gap-3">
          <span className="font-bold">Rs.{s.price}</span>
          {s.savings > 0 && <span className="text-xs text-slate-400 line-through">Rs.{data.basePrice}</span>}
          {s.savings > 0 && <span className="text-green-600 text-xs font-bold"> Save {s.savings}%</span>}
          <button onClick={() => add(s)} className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Add</button>
          
        </div>
      </div>
    ))}
  </div>
  );

}