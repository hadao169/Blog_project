import { title } from "process";

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, likes) => total + likes.likes, 0);
};

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0,
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0,
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0,
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0,
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0,
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0,
  },
];

const favoriteBlog = (blogs) => {
  let mostLikeBlog = {
    title: "",
    author: "",
    likes: "",
  };

  let max = 0;
  for (var i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > max) {
      max = blogs[i].likes;
      mostLikeBlog.title = blogs[i].title;
      mostLikeBlog.author = blogs[i].author;
      mostLikeBlog.likes = blogs[i].likes;
    }
  }
  return mostLikeBlog;
};

const mostBlogs = (blogs) => {
  const mostBlogAuthor = {
    author: "",
    blogs: 0,
  };

  // group blog by author name
  const blogByName = blogs.reduce((authors, blog) => {
    authors[blog.author] = authors[blog.author] || [];
    authors[blog.author].push(blog);
    return authors;
  }, {});

  //Second approach to group is using groupBy method of "Lodash" library
  //Third approach: directly count blogs per author and save to a object whose key and value are author and numOfBlog
  // const blogCount = blogs.reduce((counts, blog) => {
  //   counts[blog.author] = (counts[blog.author] || 0) + 1; // Count blogs per author
  //   return counts;
  // }, {});

  // find the author who has the most blogs
  for (const [author, blog] of Object.entries(blogByName)) {
    if (blog.length > mostBlogAuthor.blogs) {
      mostBlogAuthor.author = author;
      mostBlogAuthor.blogs = blog.length;
    }
  }

  // for (const author in blogByName) {
  //   if (blogByName[author].length > mostBlogAuthor.blogs) {
  //     mostBlogAuthor.author = author;
  //     mostBlogAuthor.blogs = blogByName[author].length;
  //   }
  // }
  return mostBlogAuthor;
};

const mostLikes = (blogs) => {
  const mostLikeAuthor = {
    author: "",
    likes: 0,
  };

  const likeCount = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes; // Count blogs per author
    return counts;
  }, {});

  for (const [author, likes] of Object.entries(likeCount)) {
    if (likes > mostLikeAuthor.likes) {
      mostLikeAuthor.author = author;
      mostLikeAuthor.likes = likes;
    }
  }
  return mostLikeAuthor;
};

export { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
