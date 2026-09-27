import { List, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import fictionImg from '../assets/science-fiction.png';
import nonFictionBook from '../assets/book.png';
import scienceBook from '../assets/science-book.png';
import historyBook from '../assets/history-book.png';
import technologyBook from '../assets/knowledge.png';
import useGetAllBooks from '../hooks/useGetAllBooks';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const categories = [
  { name: "Fiction", img: fictionImg, key: 'fiction' },
  { name: "Non-Fiction", img: nonFictionBook, key: 'non-fiction' },
  { name: "Science & Technology", img: scienceBook, key: 'science' },
  { name: "History & Politics", img: historyBook, key: 'history' },
  { name: "Technology", img: technologyBook, key: 'technology' },
];

function CategoriesSection() {
  const { refetch } = useGetAllBooks();
  const { user } = useSelector((state) => state.auth);
  
  // Refetch books when user logs in
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <List className="mr-2" />
          <h2 className="text-2xl font-bold text-center">Browse by Categories</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {categories.map((category, index) => (
              <Link to={`/browse?category=${category.key}`} key={category.key}>
              <Card key={index} className="relative group overflow-hidden cursor-pointer bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6 flex items-center justify-center text-center h-32">
                  <h3 className="font-medium text-lg">{category.name}</h3>
                </CardContent>

                {/* Hidden Image that Appears on Hover */}
                <div className="w-full h-full absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-450 ease-out">
                  <img src={category.img} alt={category.name} className="w-full h-full" />
                </div>
              </Card>
              </Link> 
            ))}
      </div>


      <div className="text-center mt-6">
        <button className="text-black flex items-center hover:underline">
          View All Categories <ChevronRight size={16} />
        </button>
      </div>
    </div>
    </section >
  );
}

export default CategoriesSection;
