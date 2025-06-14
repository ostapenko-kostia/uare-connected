import { Features } from '@/components/home/features'
import { Hero } from '@/components/home/hero'
import { HowItWorks } from '@/components/home/how-it-works'
import { Stats } from '@/components/home/stats'
import { Testimonials } from '@/components/home/testimonials'

export default function HomePage() {
	return (
		<>
			<Hero />
			<Features />
			<Stats />
			<HowItWorks />
			<Testimonials />
		</>
	)
}
