import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../utils/types';

interface BlogCardProps {
  post: BlogPost;
  onReadMore?: (post: BlogPost) => void;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post, onReadMore }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs font-medium text-sage-600">
            {formatDate(post.date)}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-sage-800 mb-2 line-clamp-2 hover:text-sage-600 transition-colors cursor-pointer">
          {post.title}
        </h3>
        
        <p className="text-sage-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-sage-500 mb-4">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{formatDate(post.date)}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                onTagSearch?.(tag);
              }}
              className="bg-sage-100 text-sage-600 text-xs px-2 py-1 rounded-full hover:bg-sage-200 transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onReadMore && onReadMore(post)}
          className="flex items-center text-sage-600 hover:text-sage-700 font-medium transition-colors group"
        >
          <span>Читать далее</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </article>
  );
};