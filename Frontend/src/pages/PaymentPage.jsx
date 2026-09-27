import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, StepBack } from 'lucide-react';
import { toast } from 'react-toastify';
import { incrementBorrowedBooks, setNumberOfBorrowedBooks } from '../redux/authSlice';
import api from '../utils/api';
import { Input } from '@/components/ui/input';

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentBorrowedCount = useSelector((state) => state.auth.numberOfBorrowedBooks);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Get book and payment type from location state
  const { book, paymentType } = location.state || {};
  const [step, setStep] = useState(1);
  
  // Calculate amount based on payment type
  const amount = paymentType === 'Buy' 
    ? book?.bookPrice 
    : book?.bookPrice ? book.bookPrice / 100 : 0;

  // Redirect if no book data is provided
  useEffect(() => {
    if (!book || !paymentType) {
      toast.error('Invalid payment details');
      navigate('/');
    }
  }, [book, paymentType, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Here you would typically integrate with a payment processor
      // For now, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const response = await api.post(
        '/book/borrow',
        { 
          bookId: book._id,
          accessType: paymentType
        }
      );

      if (response.data.success) {
        // Update the number of borrowed books in Redux
        dispatch(setNumberOfBorrowedBooks(currentBorrowedCount + 1));
        toast.success(`Payment of $${amount.toFixed(2)} for ${book?.title} (${paymentType}) was successful!`);
        setStep(2);
      } else {
        throw new Error(response.data.message || 'Failed to add book to your library');
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!book || !paymentType) {
    return null;
  }
  useEffect(() => {
    if (step === 2) {
      setTimeout(() => {
        navigate('/myLibrary');
      }, 1000);
    }
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete Your Purchase</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span>{book.title}</span>
              <span>${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">Payment Type:</span>
              <span className="text-sm font-medium">
                {paymentType === 'Buy' ? 'One-time Purchase' : '10-Day Subscription'}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  name="expiry"
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
            </Button>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate(-1)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaymentPage;
