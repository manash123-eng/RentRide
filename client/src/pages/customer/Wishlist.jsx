import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FiHeart } from "react-icons/fi";
import { userService } from "../../services/userService.js";
import VehicleCard from "../../components/VehicleCard.jsx";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";

const Wishlist = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => userService.getWishlist().then((r) => r.data.data),
  });

  if (isLoading) return <LoadingSpinner size="lg" />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-2xl font-bold text-white">My wishlist</h1>
      {data?.length === 0 ? (
        <div className="mt-6"><EmptyState icon={FiHeart} title="Your wishlist is empty" description="Save vehicles you like to find them here later." /></div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((v) => <VehicleCard key={v._id} vehicle={v} wishlisted onWishlistChange={refetch} />)}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
