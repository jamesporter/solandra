export function TutorialCards() {
  return (
    <div className="flex flex-row flex-wrap gap-8 ">
      <div className="flex-1 min-w-[320px] bg-gray-100 flex flex-col items-center h-[480px] overflow-hidden">
        <img
          src="/images/sol.png"
          className="w-full aspect-square"
          alt="Sol LeWitt Solandra Tutorial"
        />

        <p className="p-2">
          Or an{" "}
          <a href="https://www.amimetic.co.uk/art/solving-sol-with-solandra">
            unconventional tutorial introduction based on instructions from Sol
            LeWitt
          </a>
        </p>
      </div>

      <div className="flex-1 min-w-[320px] bg-gray-100 flex flex-col items-center h-[480px] overflow-hidden">
        <img
          src="/images/icons.png"
          alt="Icon design"
          className="w-full aspect-square"
        />
        <p className="p-2">
          This tutorial shows how you might use Solandra as a way to do{" "}
          <a href="https://www.amimetic.co.uk/art/generative-icon-design-a-solandra-tutorial/">
            Generative design for App Icons
          </a>
        </p>
      </div>

      <div className="flex-1 min-w-[320px] bg-gray-100 flex flex-col items-center h-[480px] overflow-hidden">
        <img
          className="w-full aspect-square"
          src="/images/wallpaper.png"
          alt="Wallpaper Solandra Tutorial"
        />
        <p className="p-2">
          Alternatively, why not{" "}
          <a href="https://www.amimetic.co.uk/art/apple-style-wallpaper/">
            create iOS 13 style wallpapers with Solandra
          </a>
          .
        </p>
      </div>

      <div className="flex-1 min-w-[320px] bg-gray-100 flex flex-col items-center h-[480px] overflow-hidden">
        <img
          className="w-full aspect-square"
          src="/images/watercolour.png"
          alt="Watercolours with Solandra"
        />
        <p className="p-2">
          Create{" "}
          <a href="https://www.amimetic.co.uk/art/watercolour">
            watercolour style
          </a>{" "}
          graphics with Solandra.
        </p>
      </div>
    </div>
  )
}
