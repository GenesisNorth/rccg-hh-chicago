"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

interface MediaFiltersProps {
  selectedType: string;
  selectedCategory: string;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
}

const mediaTypes = [
  { value: "all", label: "All Types" },
  { value: "IMAGE", label: "Images" },
  { value: "VIDEO", label: "Videos" },
  { value: "AUDIO", label: "Audio" },
  { value: "DOCUMENT", label: "Documents" },
];

const mediaCategories = [
  { value: "all", label: "All Categories" },
  { value: "SERMONS", label: "Sermons" },
  { value: "MUSIC", label: "Music" },
  { value: "EVENTS", label: "Events" },
  { value: "OUTREACH", label: "Outreach" },
  { value: "YOUTH", label: "Youth" },
  { value: "WOMEN", label: "Women" },
  { value: "MEN", label: "Men" },
  { value: "CHILDREN", label: "Children" },
  { value: "DOCUMENTS", label: "Documents" },
  { value: "GALLERY", label: "Gallery" },
  { value: "TESTIMONIES", label: "Testimonies" },
  { value: "ANNOUNCEMENTS", label: "Announcements" },
];

export function MediaFilters({
  selectedType,
  selectedCategory,
  onTypeChange,
  onCategoryChange,
}: MediaFiltersProps) {
  return (
    <div className="flex gap-2">
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[140px]">
          <Filter className="mr-2 h-4 w-4" />
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          {mediaTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {mediaCategories.map((category) => (
            <SelectItem key={category.value} value={category.value}>
              {category.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}