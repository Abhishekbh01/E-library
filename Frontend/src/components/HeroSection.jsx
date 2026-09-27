import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Check, ChevronRight, Clock, List, Mail, Search, Star, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import CategoriesSection from './CategoriesSection'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setSearchQuery } from '../redux/bookSlice'


function HeroSection() {
    const [searchValue, setSearchValue] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user }  = useSelector(store => store.auth);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const searchValue = e.target.value.trim(); 
            
            if (searchValue) {
                dispatch(setSearchQuery(searchValue)); 
                navigate(`/browse?q=${searchValue}`);
            }
        }
    };
    useEffect(() => {
        setSearchValue("");
        dispatch(setSearchQuery(""));
    },[])
    

    return (
        <div className='overflow-hidden m-0 p-0 box-border'>
            <section className="bg-[#bbed4e] text-black py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to E-Library</h1>
                    <h2 className="text-xl md:text-2xl mb-6">Your Digital Book Haven!</h2>
                    <p className="text-lg mb-8 max-w-2xl mx-auto">Explore a world of knowledge, anytime, anywhere. Find, Read & Discover Thousands of Books Online!</p>

                    <div className="max-w-xl mx-auto mb-8 relative">
                        <Input
                            type="text"
                            placeholder="Search by Title, Author, or Category..."
                            className="pl-10 py-6 bg-white text-black"
                            onChange={(e)=> setSearchValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            value={searchValue}
                            autoComplete="off"
                            spellCheck="false"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to='/browse'>
                            <Button className="bg-gray-800 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-900 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                                📚 Browse Books
                            </Button>
                        </Link>
                        {!user && 
                            <Button className="bg-white text-gray-800 font-semibold py-2 px-6 rounded-full border border-gray-800 shadow-md transition-all duration-300 hover:bg-gray-800 hover:text-white hover:shadow-lg hover:scale-105 flex items-center gap-2">
                                <Link to="/signup">🚀 Sign Up for Free</Link>
                            </Button>
                        }
                        
                    </div>
                </div>
            </section>

            {/* Featured Books Section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Trending Now */}
                        <div>
                            <div className="flex items-center mb-6">
                                <TrendingUp className="mr-2" />
                                <h2 className="text-2xl font-bold">Trending Now</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'The Alchemist', author: 'Paulo Coelho', img: 'https://th.bing.com/th/id/OIP.4e1QFdOlXG9h9tnoctE5eAHaLO?rs=1&pid=ImgDetMain' },
                                    { title: 'Atomic Habits', author: 'James Clear', img: 'https://cdn2.penguin.com.au/covers/original/9781473565425.jpg' },
                                    { title: 'The Psychology of Money', author: 'Morgan Housel', img: 'https://megaphone.imgix.net/podcasts/7d795460-aca3-11ee-a0d5-9fa6c79e4c74/image/202f2f.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress' }
                                ].map((book, index) => (
                                    <div key={index} className="flex bg-white p-3 rounded-lg shadow-sm">
                                        <img src={book.img} alt={book.title} className="w-16 h-24 object-cover mr-4" />
                                        <div>
                                            <h3 className="font-bold">{book.title}</h3>
                                            <p className="text-gray-600">{book.author}</p>
                                            <Button variant="link" className="p-0 h-auto text-black">Read Now</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recently Added */}
                        <div>
                            <div className="flex items-center mb-6">
                                <Clock className="mr-2" />
                                <h2 className="text-2xl font-bold">Recently Added</h2>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { title: 'Deep Work', author: 'Cal Newport', img: 'https://th.bing.com/th/id/OIP.ZQWT-msUo2tlStswZOhFdgHaLk?rs=1&pid=ImgDetMain' },
                                    { title: 'Sapiens', author: 'Yuval Noah Harari', img: 'https://i5.walmartimages.com/asr/e8b5c724-b7c1-4c8f-97c2-4e3ae8bfce8b_1.5870575db94cbd1528611d7e6a8e8c8f.jpeg' },
                                    { title: 'Zero to One', author: 'Peter Thiel', img: 'https://th.bing.com/th/id/OIP.FHlsn2_WKOsLEyIOxLK5kAHaLH?rs=1&pid=ImgDetMain' }
                                ].map((book, index) => (
                                    <div key={index} className="flex bg-white p-3 rounded-lg shadow-sm">
                                        <img src={book.img} alt={book.title} className="w-16 h-24 object-cover mr-4" />
                                        <div>
                                            <h3 className="font-bold">{book.title}</h3>
                                            <p className="text-gray-600">{book.author}</p>
                                            <Button variant="link" className="p-0 h-auto text-black">Read Now</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link to='/browse'>
                            <Button className="bg-black text-white hover:bg-gray-800">
                                Explore More Books
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <CategoriesSection/>

            {/* Why Choose Section */}
            <section className="py-12 bg-black text-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">Why Choose E-Library?</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: 'Unlimited Access', desc: 'Read books anytime, anywhere.' },
                            { title: 'Diverse Collection', desc: 'Thousands of books across multiple genres.' },
                            { title: 'User-Friendly', desc: 'Easy search, bookmark, and personalized recommendations.' },
                            { title: 'Completely Free', desc: 'Join now & start reading instantly!' },
                        ].map((feature, index) => (
                            <div key={index} className="flex">
                                <div className="mr-3 text-white">
                                    <Check />
                                </div>
                                <div>
                                    <h3 className="font-bold mb-1">{feature.title}</h3>
                                    <p className="text-gray-300">{feature.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button className="bg-white text-black hover:bg-gray-200">
                            Start Reading Now
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-8">User Testimonials</h2>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {[
                            { quote: 'E-Library has transformed the way I read. The collection is fantastic!', author: 'Rahul M.' },
                            { quote: 'A perfect platform for book lovers. Easy to use and free!', author: 'Priya S.' }
                        ].map((testimonial, index) => (
                            <Card key={index} className="bg-white">
                                <CardContent className="p-6">
                                    <div className="flex mb-4">
                                        {[1, 2, 3, 4, 5].map((_, i) => (
                                            <Star key={i} size={16} fill="#000" className="text-black" />
                                        ))}
                                    </div>
                                    <p className="italic mb-4">"{testimonial.quote}"</p>
                                    <p className="font-medium">– {testimonial.author}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <Button variant="link" className="text-black flex items-center justify-center">
                            Read More Reviews <ChevronRight size={16} />
                        </Button>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-12 bg-gray-100">
                <div className="container mx-auto px-4 text-center max-w-xl">
                    <div className="flex items-center justify-center mb-2">
                        <Mail className="mr-2" />
                        <h2 className="text-2xl font-bold">Stay Updated!</h2>
                    </div>
                    <p className="mb-6">Get the latest book releases and recommendations.</p>

                    <div className="flex">
                        <Input placeholder="Enter your email" className="rounded-r-none" />
                        <Button className="bg-black text-white hover:bg-gray-800 rounded-l-none">
                            Subscribe
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HeroSection