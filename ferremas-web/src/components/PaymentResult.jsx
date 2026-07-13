import { useSearchParams, Link } from 'react-router-dom';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const status = searchParams.get('status');
    const monto = searchParams.get('monto');
    const orden = searchParams.get('orden');
    const auth = searchParams.get('auth');

    if (status === 'exito') {
        return (
            <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl text-center mt-10 border-t-8 border-green-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">¡Pago Exitoso!</h2>
                <p className="text-gray-600 mb-6 font-medium">Transacción aprobada y procesada correctamente.</p>

                <div className="bg-gray-50 rounded p-5 text-left border border-gray-200 mb-6 space-y-2">
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-500">Orden de Compra:</span>
                        <span className="font-bold text-gray-800">{orden}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                        <span className="text-sm text-gray-500">Código Autorización:</span>
                        <span className="font-bold text-gray-800">{auth}</span>
                    </div>
                    <div className="flex justify-between pt-2">
                        <span className="text-sm text-gray-500">Total Pagado:</span>
                        <span className="font-black text-lg text-purple-900">${Number(monto).toLocaleString('es-CL')}</span>
                    </div>
                </div>

                <Link to="/" className="inline-block bg-amber-500 text-black font-extrabold py-3 px-8 rounded shadow-md hover:bg-amber-600 active:scale-95 transition-all">
                    Volver a la Tienda
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-xl text-center mt-10 border-t-8 border-red-500">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
            </div>
            <h2 className="text-3xl font-black text-gray-800 mb-2">Pago Rechazado</h2>
            <p className="text-gray-600 mb-6">Tu pago fue cancelado o rechazado por el banco. No se han realizado cargos a tu tarjeta.</p>
            <Link to="/" className="inline-block bg-purple-900 text-white font-bold py-3 px-8 rounded shadow-md hover:bg-purple-800 active:scale-95 transition-all">
                Intentar Nuevamente
            </Link>
        </div>
    );
};

export default PaymentResult;