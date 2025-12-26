import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // Thay bằng Email và Mật khẩu ứng dụng của bạn (giống bên userController)
      user: 'khangtrieugioi@gmail.com', 
      pass: 'tjfw cotl xhjs ixtn', 
    },
  });

  const message = {
    from: 'K-Perfume Store <no-reply@kperfume.vn>',
    to: options.email,
    subject: options.subject,
    html: options.message, // Chúng ta dùng HTML để email đơn hàng nhìn đẹp hơn
  };

  await transporter.sendMail(message);
};

export default sendEmail;