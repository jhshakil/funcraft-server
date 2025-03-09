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

export const StatsServices = {
  userStats,
};
