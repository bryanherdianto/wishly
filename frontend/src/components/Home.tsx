import { Link } from "react-router-dom"
import { FaBirthdayCake, FaMusic, FaImage, FaPalette } from "react-icons/fa"

const Home = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <section className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 text-gray-800">Create Beautiful Birthday Pages</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Design personalized birthday pages for your friends and family with our easy-to-use generator. Share the link
          and make their day special!
        </p>
        <Link
          to="/manage"
          className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          Create a Birthday Page
        </Link>
      </section>

      <section className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="bg-pink-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <FaPalette className="text-pink-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Choose a Theme</h3>
          <p className="text-gray-600">
            Select from multiple beautiful themes to match the birthday person's style and preferences.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <FaImage className="text-purple-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Add Photos</h3>
          <p className="text-gray-600">
            Upload photos of the birthday person to make the page more personal and memorable.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
            <FaMusic className="text-blue-600 text-2xl" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800">Include Music</h3>
          <p className="text-gray-600">
            Add birthday music to create a festive atmosphere when they open their special page.
          </p>
        </div>
      </section>

      <section className="bg-white p-8 rounded-xl shadow-md mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              1
            </div>
            <h3 className="font-semibold mb-2">Create a Birthday Card</h3>
            <p className="text-gray-600">Fill out the form with the birthday person's details and preferences.</p>
          </div>
          <div className="text-center">
            <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              2
            </div>
            <h3 className="font-semibold mb-2">Customize the Design</h3>
            <p className="text-gray-600">Choose colors, add photos, and personalize the message.</p>
          </div>
          <div className="text-center">
            <div className="bg-pink-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
              3
            </div>
            <h3 className="font-semibold mb-2">Share the Link</h3>
            <p className="text-gray-600">Send the unique URL to the birthday person and make them smile!</p>
          </div>
        </div>
      </section>

      <section className="text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Ready to Create a Birthday Surprise?</h2>
        <Link
          to="/manage"
          className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-8 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
        >
          <FaBirthdayCake className="mr-2" /> Get Started Now
        </Link>
      </section>
    </div>
  )
}

export default Home
