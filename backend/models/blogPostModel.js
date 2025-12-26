import mongoose from 'mongoose';

const blogPostSchema = mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        slug: { 
            type: String, 
            required: true, 
            unique: true 
        },
        content: { 
            type: String,
            required: true,
        },
        // === ĐÃ SỬA TẠI ĐÂY: Đổi sang String để nhận chữ "Kiến thức" ===
        category: { 
            type: String,
            required: true, 
            default: 'Kiến thức' 
        },
        image: { 
            type: String,
            required: false, 
            default: '/images/sample.jpg', 
        },
        views: {
            type: Number,
            required: true,
            default: 0,
        },
        isApproved: { 
            type: Boolean,
            required: true,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Middleware tạo slug tự động (Hỗ trợ Tiếng Việt)
blogPostSchema.pre('save', function(next) {
    // Chỉ tạo slug nếu chưa có hoặc nếu tiêu đề bị thay đổi
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Bỏ dấu tiếng Việt
            .replace(/[đĐ]/g, "d")
            .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
            .trim()
            .replace(/\s+/g, '-'); // Thay khoảng trắng bằng gạch ngang
    }
    next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;