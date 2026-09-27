import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import fictionImg from '../../assets/science-fiction.png'
import nonFictionBook from '../../assets/book.png'
import scienceBook from '../../assets/science-book.png'
import historyBook from '../../assets/history-book.png'
import technologyBook from '../../assets/knowledge.png'
import seeAll from '../../assets/list.png'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, Search, User2, LayoutDashboard, BookOpen, Users, ShoppingBag, Home } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from '../../redux/store'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import {
    Avatar,
    AvatarImage
} from '@/components/ui/avatar'
import MemberProfile from '../MemberProfile'

function Navbar() {
    const { user } = useSelector(store => store.auth);
    return (
        <div className='bg-black overflow-hidden m-0 p-0 box-border'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 overflow-hidden m-0 p-0 box-border'>
                <div>
                    <Link to="/"><h1 className='text-white font-bold text-2xl'><span className='text-green-500 text-4xl'>E</span>-Library</h1></Link>
                </div>
                <div>
                    <ul className='flex space-x-5 items-center'>
                        {user?.role === 'admin' ? (
                            // Admin Navigation
                            <>
                                <li>
                                    <Link to="/admin/dashboard" className='flex items-center text-white hover:text-gray-300'>
                                        <LayoutDashboard className='mr-1 h-4 w-4' />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/books" className='flex items-center text-white hover:text-gray-300'>
                                        <BookOpen className='mr-1 h-4 w-4' />
                                        <span>Books</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/users" className='flex items-center text-white hover:text-gray-300'>
                                        <Users className='mr-1 h-4 w-4' />
                                        <span>Users</span>
                                    </Link>
                                </li>
                            </>
                        ) : (
                            // Regular User Navigation
                            <>
                                <li><Link to="/browse" className='text-white hover:text-gray-300'>Browse</Link></li>
                                <li>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Link className="text-white hover:text-gray-300" to="/category">Categories</Link>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56">
                                            <DropdownMenuItem asChild>
                                                <Link to="/browse?category=fiction">
                                                    Fiction
                                                    <DropdownMenuShortcut><img src={fictionImg} width="25px" alt="Fiction" /></DropdownMenuShortcut>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/browse?category=non-fiction">
                                                    Non-Fiction
                                                    <DropdownMenuShortcut><img src={nonFictionBook} width="25px" alt="Non-Fiction" /></DropdownMenuShortcut>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/browse?category=science">
                                                    Science
                                                    <DropdownMenuShortcut><img src={scienceBook} width="25px" alt="Science" /></DropdownMenuShortcut>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/browse?category=history">
                                                    History
                                                    <DropdownMenuShortcut><img src={historyBook} width="25px" alt="History" /></DropdownMenuShortcut>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/browse?category=technology">
                                                    Technology
                                                    <DropdownMenuShortcut><img src={technologyBook} width="25px" alt="Technology" /></DropdownMenuShortcut>
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem asChild>
                                                <Link to="/browse">
                                                    See All
                                                    <DropdownMenuShortcut><img src={seeAll} width="25px" alt="See All" /></DropdownMenuShortcut>
                                                </Link>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </li>
                                <li><Link to="/myLibrary" className='text-white hover:text-gray-300'>My Library</Link></li>
                                <li className="flex items-center">
                                    <div className="flex w-full max-w-md border rounded-full overflow-hidden bg-white">
                                        <Input
                                            className="flex-1 text-black bg-transparent h-9 px-4 border-none focus:outline-none"
                                            placeholder="Search books"
                                        />
                                        <Button className="bg-[#38c29b] hover:bg-[#447c60] px-4 rounded-r-full flex items-center justify-center">
                                            <Search className="h-5 w-5 text-white" />
                                        </Button>
                                    </div>
                                </li>
                            </>
                        )}
                        {
                            !user ? (
                                <>
                                    <li><Link to='/login'><Button className='bg-white px-6 py-2 text-black hover:bg-gray-300'>Login</Button></Link></li>
                                    <li><Link to='/signup'><Button className='bg-green-500 px-4 py-2 text-white hover:bg-green-700'>Sign Up</Button></Link></li>
                                </>
                            ) : (
                                <MemberProfile />
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default Navbar