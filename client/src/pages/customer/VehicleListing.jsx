import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FiSearch, FiFilter, FiX, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { vehicleService } from "../../services/vehicleService.js";
import VehicleCard from "../../components/VehicleCard.jsx";
import VehicleCardSkeleton from "../../components/VehicleCardSkeleton.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import { useDebounce } from "../../hooks/useDebounce.js";

const categories = ["Sedan", "SUV", "Hatchback", "Luxury", "Convertible", "Van", "Truck", "Electric", "Bike"];

const VehicleListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    location: searchParams.get("location") || "",
    minPrice: "",
    maxPrice: "",
    transmission: "",
    fuelType: "",
    sort: "-createdAt",
  });
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 400);

  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", debouncedSearch, filters, page],
    queryFn: () =>
      vehicleService
        .getAll({ search: debouncedSearch, ...filters, page, limit: 12, availableOnly: true })
        .then((r) => r.data),
  });

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ category: "", location: "", minPrice: "", maxPrice: "", transmission: "", fuelType: "", sort: "-createdAt" });
    setSearch("");
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Browse our fleet</h1>
          <p className="mt-1 text-sm text-slate-400">{data?.pagination?.total ?? "..."} vehicles available for rent</p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-72">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vehicles..." className="input-field pl-11" />
          </div>
          <button onClick={() => setShowFilters((s) => !s)} className="btn-secondary px-4">
            <FiFilter size={16} /> Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {showFilters && (
          <aside className="card h-fit space-y-5 p-5 lg:col-span-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold text-white">Filters</h3>
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-electric-400 hover:underline">
                <FiX size={12} /> Clear all
              </button>
            </div>

            <div>
              <label className="label-text">Category</label>
              <select value={filters.category} onChange={(e) => updateFilter("category", e.target.value)} className="input-field">
                <option value="">All categories</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="label-text">Location</label>
              <input value={filters.location} onChange={(e) => updateFilter("location", e.target.value)} placeholder="Any city" className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-text">Min price</label>
                <input type="number" value={filters.minPrice} onChange={(e) => updateFilter("minPrice", e.target.value)} placeholder="₹0" className="input-field" />
              </div>
              <div>
                <label className="label-text">Max price</label>
                <input type="number" value={filters.maxPrice} onChange={(e) => updateFilter("maxPrice", e.target.value)} placeholder="₹20000" className="input-field" />
              </div>
            </div>

            <div>
              <label className="label-text">Transmission</label>
              <select value={filters.transmission} onChange={(e) => updateFilter("transmission", e.target.value)} className="input-field">
                <option value="">Any</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="label-text">Fuel type</label>
              <select value={filters.fuelType} onChange={(e) => updateFilter("fuelType", e.target.value)} className="input-field">
                <option value="">Any</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="label-text">Sort by</label>
              <select value={filters.sort} onChange={(e) => updateFilter("sort", e.target.value)} className="input-field">
                <option value="-createdAt">Newest first</option>
                <option value="pricePerDay">Price: low to high</option>
                <option value="-pricePerDay">Price: high to low</option>
                <option value="-ratingsAverage">Top rated</option>
              </select>
            </div>
          </aside>
        )}

        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 9 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
            </div>
          ) : data?.data?.length === 0 ? (
            <EmptyState
              icon={FiSearch}
              title="No vehicles found"
              description="Try adjusting your filters or search term to find more results."
              action={<button onClick={clearFilters} className="btn-primary">Clear filters</button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data?.data?.map((v) => <VehicleCard key={v._id} vehicle={v} />)}
              </div>

              {data?.pagination?.pages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary px-3 py-2 disabled:opacity-40">
                    <FiChevronLeft size={16} />
                  </button>
                  <span className="px-4 text-sm text-slate-400">Page {page} of {data.pagination.pages}</span>
                  <button disabled={page === data.pagination.pages} onClick={() => setPage((p) => p + 1)} className="btn-secondary px-3 py-2 disabled:opacity-40">
                    <FiChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleListing;
