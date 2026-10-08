import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Check,
  ChevronRight,
  Clock,
  Mail,
  Search,
  Star,
  TrendingUp,
  BookOpen,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CategoriesSection from "./CategoriesSection";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../redux/bookSlice";

function HeroSection() {
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const handleSearch = () => {
    const query = searchValue.trim();

    if (query) {
      dispatch(setSearchQuery(query));
      navigate(`/browse?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    setSearchValue("");
    dispatch(setSearchQuery(""));
  }, [dispatch]);

  const trendingBooks = [
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      img: "https://th.bing.com/th/id/OIP.4e1QFdOlXG9h9tnoctE5eAHaLO?rs=1&pid=ImgDetMain",
      category: "Fiction",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      img: "https://cdn2.penguin.com.au/covers/original/9781473565425.jpg",
      category: "Self Improvement",
    },
    {
      title: "The Psychology of Money",
      author: "Morgan Housel",
      img: "https://megaphone.imgix.net/podcasts/7d795460-aca3-11ee-a0d5-9fa6c79e4c74/image/202f2f.png?ixlib=rails-4.3.1&max-w=3000&max-h=3000&fit=crop&auto=format,compress",
      category: "Finance",
    },
  ];

  const recentBooks = [
    {
      title: "Deep Work",
      author: "Cal Newport",
      img: "https://th.bing.com/th/id/OIP.ZQWT-msUo2tlStswZOhFdgHaLk?rs=1&pid=ImgDetMain",
      category: "Productivity",
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      img: "https://i5.walmartimages.com/asr/e8b5c724-b7c1-4c8f-97c2-4e3ae8bfce8b_1.5870575db94cbd1528611d7e6a8e8c8f.jpeg",
      category: "History",
    },
    {
      title: "Zero to One",
      author: "Peter Thiel",
      img: "https://th.bing.com/th/id/OIP.FHlsn2_WKOsLEyIOxLK5kAHaLH?rs=1&pid=ImgDetMain",
      category: "Business",
    },
  ];

  const features = [
    {
      title: "Unlimited Access",
      desc: "Read your favorite books anytime, anywhere.",
    },
    {
      title: "Diverse Collection",
      desc: "Discover books across multiple genres and interests.",
    },
    {
      title: "Easy to Use",
      desc: "Search, explore, and discover books effortlessly.",
    },
    {
      title: "Completely Free",
      desc: "Join our community and start reading today.",
    },
  ];

  const testimonials = [
    {
      quote:
        "E-Library has transformed the way I read. The collection is fantastic!",
      author: "Rahul M.",
    },
    {
      quote:
        "A perfect platform for book lovers. Easy to use and free!",
      author: "Priya S.",
    },
  ];

  const renderBookSection = (title, icon, books, label) => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-violet-100 p-3 text-violet-700">
            {icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {title}
            </h2>
            <p className="text-sm text-slate-500">
              {label}
            </p>
          </div>
        </div>

        <Link
          to="/browse"
          className="hidden items-center gap-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900 sm:flex"
        >
          View all <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book, index) => (
          <Card
            key={index}
            className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-xl"
          >
            <CardContent className="p-4">
              <div className="relative mb-5 flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-100 via-purple-50 to-indigo-100 p-4">
                <img
                  src={book.img}
                  alt={book.title}
                  className="h-full max-w-full rounded-lg object-contain shadow-lg transition-transform duration-500 group-hover:scale-105"
                />

                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-violet-700 shadow-sm backdrop-blur">
                  {book.category}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="line-clamp-1 text-lg font-bold text-slate-900">
                    {book.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    by {book.author}
                  </p>
                </div>

                <Link to="/browse" className="block">
                  <Button className="w-full rounded-xl bg-slate-900 text-white transition-all hover:bg-violet-700">
                    Read Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf9f6] text-slate-900">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-[#111126] text-white">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:px-10 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div className="text-center lg:text-left">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-violet-200 backdrop-blur">
                <Sparkles size={16} />
                Your personal digital library
              </div>

              <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-7xl">
                A world of
                <span className="block bg-gradient-to-r from-violet-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  stories & ideas.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-300 md:text-lg lg:mx-0">
                Discover your next favorite book. Explore thousands of stories,
                ideas, and knowledge — all in one beautiful place.
              </p>

              {/* SEARCH BAR */}
              <div className="mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white p-2 shadow-2xl shadow-black/20 lg:mx-0">
                <Search className="ml-3 shrink-0 text-slate-400" size={21} />

                <Input
                  type="text"
                  placeholder="Search books, authors, categories..."
                  className="h-12 border-0 bg-transparent text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={searchValue}
                  autoComplete="off"
                  spellCheck="false"
                />

                <Button
                  onClick={handleSearch}
                  className="h-12 shrink-0 rounded-xl bg-violet-600 px-5 text-white hover:bg-violet-700"
                >
                  Search
                </Button>
              </div>

              {/* BUTTONS */}
              <div className="mt-7 flex flex-wrap justify-center gap-4 lg:justify-start">
                <Link to="/browse">
                  <Button className="h-12 rounded-xl bg-white px-6 font-semibold text-slate-900 hover:bg-violet-100">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Books
                  </Button>
                </Link>

                {!user && (
                  <Link to="/signup">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl border-white/20 bg-white/5 px-6 text-white hover:bg-white/10 hover:text-white"
                    >
                      Get Started <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                )}
              </div>

              <div className="mt-9 flex flex-wrap justify-center gap-6 text-sm text-slate-400 lg:justify-start">
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-violet-300" />
                  Free to explore
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-violet-300" />
                  Thousands of books
                </span>
                <span className="flex items-center gap-2">
                  <Check size={16} className="text-violet-300" />
                  Read anywhere
                </span>
              </div>
            </div>

            {/* HERO BOOK SHOWCASE */}
            <div className="relative mx-auto hidden w-full max-w-md lg:block">
              <div className="absolute inset-0 rounded-full bg-violet-500/20 blur-3xl" />

              <div className="relative grid grid-cols-2 items-center gap-5">
                <div className="mt-12 rotate-[-7deg] rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur transition-transform duration-500 hover:rotate-0">
                  <img
                    src={trendingBooks[0].img}
                    alt={trendingBooks[0].title}
                    className="h-64 w-full rounded-xl object-cover"
                  />
                  <p className="mt-4 font-bold">{trendingBooks[0].title}</p>
                  <p className="mt-1 text-sm text-slate-400">
                    {trendingBooks[0].author}
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="rotate-[6deg] rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur transition-transform duration-500 hover:rotate-0">
                    <img
                      src={trendingBooks[1].img}
                      alt={trendingBooks[1].title}
                      className="h-52 w-full rounded-xl object-cover"
                    />
                    <p className="mt-4 font-bold">{trendingBooks[1].title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {trendingBooks[1].author}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-violet-500/20 p-3 text-violet-200">
                        <BookOpen size={22} />
                      </div>
                      <div>
                        <p className="font-semibold">Find your next read</p>
                        <p className="text-sm text-slate-400">
                          Explore something new.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BOOK COLLECTION */}
      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl space-y-20 px-5 md:px-10">
          {renderBookSection(
            "Trending Now",
            <TrendingUp size={22} />,
            trendingBooks,
            "Popular reads loved by readers"
          )}

          {renderBookSection(
            "Recently Added",
            <Clock size={22} />,
            recentBooks,
            "Fresh additions to your collection"
          )}

          <div className="text-center">
            <Link to="/browse">
              <Button className="h-12 rounded-xl bg-slate-900 px-8 text-white hover:bg-violet-700">
                Explore All Books <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-y border-slate-200/70 bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <CategoriesSection />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="bg-[#111126] py-20 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="mb-4 inline-block rounded-full bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-300">
              The E-Library experience
            </span>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              More than just a library.
            </h2>

            <p className="mt-5 leading-7 text-slate-400">
              Everything you need to discover, explore, and enjoy your next
              great read.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-white/[0.08]"
              >
                <div className="mb-6 inline-flex rounded-2xl bg-violet-500/15 p-4 text-violet-300">
                  <Check size={24} />
                </div>

                <h3 className="mb-3 text-lg font-bold">{feature.title}</h3>

                <p className="text-sm leading-7 text-slate-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/browse">
              <Button className="h-12 rounded-xl bg-violet-600 px-8 text-white hover:bg-violet-700">
                Start Reading <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#faf9f6] py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700">
              Reader Stories
            </span>

            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              Words from our readers.
            </h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="rounded-3xl border border-slate-200/70 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="p-8">
                  <div className="mb-6 flex gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} size={17} fill="currentColor" />
                    ))}
                  </div>

                  <p className="text-lg leading-8 text-slate-700">
                    "{testimonial.quote}"
                  </p>

                  <div className="mt-7 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-100 font-bold text-violet-700">
                      {testimonial.author.charAt(0)}
                    </div>

                    <div>
                      <p className="font-bold text-slate-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-slate-500">Reader</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="px-5 py-16 md:px-10 md:py-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900 px-6 py-14 text-center text-white shadow-xl md:px-16 md:py-20">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative mx-auto max-w-2xl">
            <div className="mx-auto mb-6 inline-flex rounded-2xl bg-white/10 p-4">
              <Mail size={28} />
            </div>

            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              A little more inspiration?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-violet-100">
              Discover new books, fresh ideas, and reading recommendations
              delivered straight to your inbox.
            </p>

            <div className="mx-auto mt-8 flex max-w-lg flex-col gap-3 rounded-2xl bg-white p-2 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-12 border-0 bg-transparent text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
              />

              <Button className="h-12 rounded-xl bg-slate-900 px-6 text-white hover:bg-slate-800">
                Subscribe <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <p className="mt-4 text-xs text-violet-200">
              A world of reading, delivered to you.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HeroSection;