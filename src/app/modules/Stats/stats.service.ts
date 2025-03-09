import {
  startOfMonth,
  startOfYear,
  eachMonthOfInterval,
  eachYearOfInterval,
  format,
} from "date-fns";
import { prisma } from "../../../shared/prisma";

export const userStats = async (userId: string) => {
  // Total Orders
  const totalOrders = await prisma.order.count({
    where: { customerId: userId },
  });

  // Total Payment
  const totalPayment = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: { customerId: userId, paymentStatus: "PAID" },
  });

  // Total Reviews
  const totalReviews = await prisma.review.count({
    where: { customerId: userId },
  });

  // Today's Payment
  const todayPayment = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: {
      customerId: userId,
      paymentStatus: "PAID",
      createdAt: { gte: startOfMonth(new Date()) },
    },
  });

  // Get Monthly Payment Data (Last 6 Months)
  const last6Months = eachMonthOfInterval({
    start: startOfMonth(
      new Date(new Date().getFullYear(), new Date().getMonth() - 5)
    ),
    end: new Date(),
  });

  const monthlyPayments = await Promise.all(
    last6Months.map(async (date) => {
      const sum = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          customerId: userId,
          paymentStatus: "PAID",
          createdAt: {
            gte: startOfMonth(date),
            lt: startOfMonth(new Date(date.getFullYear(), date.getMonth() + 1)),
          },
        },
      });
      return { name: format(date, "MMMM"), value: sum._sum.totalPrice || 0 };
    })
  );

  // Get Yearly Payment Data (Last 5 Years)
  const last5Years = eachYearOfInterval({
    start: startOfYear(new Date(new Date().getFullYear() - 4, 0)),
    end: new Date(),
  });

  const yearlyPayments = await Promise.all(
    last5Years.map(async (date) => {
      const sum = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          customerId: userId,
          paymentStatus: "PAID",
          createdAt: {
            gte: startOfYear(date),
            lt: startOfYear(new Date(date.getFullYear() + 1, 0)),
          },
        },
      });
      return { name: format(date, "yyyy"), value: sum._sum.totalPrice || 0 };
    })
  );

  return {
    totalOrders,
    totalPayment: totalPayment._sum.totalPrice || 0,
    totalReviews,
    todayPayment: todayPayment._sum.totalPrice || 0,
    monthlyPayments, // Data formatted for charts with month names
    yearlyPayments, // Data formatted for charts
  };
};

export const vendorStats = async (shopId: string) => {
  // Total Products in the Shop
  const totalProducts = await prisma.product.count({ where: { shopId } });

  // Total Orders for the Shop
  const totalOrders = await prisma.order.count({ where: { shopId } });

  // Total Sales (Paid Orders)
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: { shopId, paymentStatus: "PAID" },
  });

  // Get Monthly Sales Data (Last 6 Months)
  const last6Months = eachMonthOfInterval({
    start: startOfMonth(
      new Date(new Date().getFullYear(), new Date().getMonth() - 5)
    ),
    end: new Date(),
  });

  const monthlySales = await Promise.all(
    last6Months.map(async (date) => {
      const sum = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          shopId,
          paymentStatus: "PAID",
          createdAt: {
            gte: startOfMonth(date),
            lt: startOfMonth(new Date(date.getFullYear(), date.getMonth() + 1)),
          },
        },
      });
      return { name: format(date, "MMMM"), value: sum._sum.totalPrice || 0 };
    })
  );

  // Get Yearly Sales Data (Last 5 Years)
  const last5Years = eachYearOfInterval({
    start: startOfYear(new Date(new Date().getFullYear() - 4, 0)),
    end: new Date(),
  });

  const yearlySales = await Promise.all(
    last5Years.map(async (date) => {
      const sum = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: {
          shopId,
          paymentStatus: "PAID",
          createdAt: {
            gte: startOfYear(date),
            lt: startOfYear(new Date(date.getFullYear() + 1, 0)),
          },
        },
      });
      return { name: format(date, "yyyy"), value: sum._sum.totalPrice || 0 };
    })
  );

  return {
    totalProducts,
    totalOrders,
    totalSales: totalSales._sum.totalPrice || 0,
    monthlySales, // Data formatted for charts with month names
    yearlySales, // Data formatted for charts
  };
};

export const adminStats = async () => {
  // Fetch total counts
  const totalProducts = await prisma.product.count();
  const totalOrders = await prisma.order.count();
  const totalUsers = await prisma.customer.count();
  const totalReviews = await prisma.review.count();
  const totalShops = await prisma.shop.count();

  // Fetch total sales (only PAID orders)
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
    where: { paymentStatus: "PAID" },
  });

  // Get the last 6 months for the report
  const last6Months = eachMonthOfInterval({
    start: startOfMonth(
      new Date(new Date().getFullYear(), new Date().getMonth() - 5)
    ),
    end: startOfMonth(new Date()), // Ensure we compare from the start of the current month
  });

  // Fetch Monthly Sales & Orders
  const monthlyReports = await Promise.all(
    last6Months.map(async (date) => {
      const salesData = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
        where: {
          paymentStatus: "PAID",
          createdAt: {
            gte: startOfMonth(date),
            lt: startOfMonth(new Date(date.getFullYear(), date.getMonth() + 1)),
          },
        },
      });

      return {
        name: format(date, "MMMM"),
        sales: salesData._sum.totalPrice || 0,
        orders: salesData._count.id || 0,
      };
    })
  );

  // Get the last 5 years for the report
  const last5Years = eachYearOfInterval({
    start: startOfYear(new Date(new Date().getFullYear() - 4, 0)),
    end: startOfYear(new Date()), // Ensure we compare from the start of the current year
  });

  // Fetch Yearly Sales & Orders
  const yearlyReports = await Promise.all(
    last5Years.map(async (date) => {
      const salesData = await prisma.order.aggregate({
        _sum: { totalPrice: true },
        _count: { id: true },
        where: {
          paymentStatus: "PAID",
          createdAt: {
            gte: startOfYear(date),
            lt: startOfYear(new Date(date.getFullYear() + 1, 0)),
          },
        },
      });

      return {
        name: format(date, "yyyy"),
        sales: salesData._sum.totalPrice || 0,
        orders: salesData._count.id || 0,
      };
    })
  );

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalSales: totalSales._sum.totalPrice || 0,
    totalReviews,
    totalShops,
    monthlySales: monthlyReports.map((data) => ({
      name: data.name,
      value: data.sales,
    })), // Monthly Sales Report
    monthlyOrders: monthlyReports.map((data) => ({
      name: data.name,
      value: data.orders,
    })), // Monthly Orders Report
    yearlySales: yearlyReports.map((data) => ({
      name: data.name,
      value: data.sales,
    })), // Yearly Sales Report
    yearlyOrders: yearlyReports.map((data) => ({
      name: data.name,
      value: data.orders,
    })), // Yearly Orders Report
  };
};

export const StatsServices = {
  userStats,
  vendorStats,
  adminStats,
};
