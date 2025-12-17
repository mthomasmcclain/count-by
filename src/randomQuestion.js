export default function randomQuestion(step, min, max, n=5, missingCount=2) {
	// idea is to get 5 consecutive multiples of the "step" between the min and the max
	// first, we gotta find out how many "valid" starting ones there are, that don't exceed the max
	const effectiveMax = max - step*n // we don't want ANY choices outside the range
	const first = randomElement(multiplesBetween(min, effectiveMax, step))

	// sequence is the ramodn sequence of n consecutive multiples of step within the range
	const sequence = [ ]
	for (let i=0; i<=n; i++) { sequence.push(first + i*step) }


	// Randomly pick missing indices
	const indices = [...Array(n).keys()]
	const missingIndices = []
	while (missingIndices.length < Math.min(missingCount, n)) {
		const candidate = randomElement(indices)
		if (!missingIndices.includes(candidate)) missingIndices.push(candidate)
	}

	// Build question data
	const items = sequence.map((value, i) => ({
	value,
	missing: missingIndices.includes(i),
	userInput: missingIndices.includes(i) ? '' : value // locked numbers get prefilled
	}))

	return items
}


function multiplesBetween(min, max, step) {
  const start = Math.ceil(min / step) * step
  const result = []
  for (let n = start; n <= max; n += step) {
    result.push(n)
  }
  return result
}

function randomElement(arr) {
  if (!arr || arr.length === 0) return undefined
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}