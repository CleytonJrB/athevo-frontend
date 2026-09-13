"use client"

import React, { useMemo, useState } from "react"

import { normalizeText } from "@/lib/formats"

import { ExerciseCard } from "./exercise-card"
import { ExerciseFilters } from "./exercise-filters"
import { ExercisesPageHeader } from "./exercises-page-header"
import { exercises } from "../_data/exercises"
import { ExerciseEmptyList } from "./exercise-empty-list"

export function ExercisesLibrary() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [showMore, setShowMore] = useState(false)

  const filteredExercises = useMemo(() => {
    const normalizedSearch = normalizeText(search.trim())

    return exercises.filter((exercise) => {
      const matchesCategory =
        activeCategory === "Todos" || exercise.muscleGroup === activeCategory
      const matchesSearch =
        !normalizedSearch ||
        normalizeText(`${exercise.name} ${exercise.muscleGroup} ${exercise.equipment}`).includes(
          normalizedSearch,
        )

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  function toggleMoreCategories() {
    if (showMore && activeCategory === "Core") {
      setActiveCategory("Todos")
    }

    setShowMore((current) => !current)
  }

  return (
    <React.Fragment>
      <ExercisesPageHeader />

      <ExerciseFilters
        search={search}
        activeCategory={activeCategory}
        showMore={showMore}
        onSearchChange={setSearch}
        onCategoryChange={setActiveCategory}
        onToggleMore={toggleMoreCategories}
      />

      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredExercises.map((exercise) => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <ExerciseEmptyList />
      )}
    </React.Fragment>
  )
}
