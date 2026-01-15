// import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon } from '@heroicons/react/24/outline'

import { Zap } from "lucide-react";
import Title from "./Title";

/* updated tempicon to accept props so color/size classes passed from caller work */
const tempicon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
    <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99v1.27a1.5 1.5 0 0 0-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.66a6.727 6.727 0 0 0 .551-1.607 1.5 1.5 0 0 0 .14-2.67v-.645a48.549 48.549 0 0 1 3.44 1.667 2.25 2.25 0 0 0 2.12 0Z" />
    <path d="M4.462 19.462c.42-.419.753-.89 1-1.395.453.214.902.435 1.347.662a6.742 6.742 0 0 1-1.286 1.794.75.75 0 0 1-1.06-1.06Z" />
  </svg>
);

const features = [
  {
    name: 'Push to deploy',
    description:
      'Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.',
    icon: tempicon,
  },
  {
    name: 'SSL certificates',
    description:
      'Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.',
    icon: tempicon,
  },
  {
    name: 'Simple queues',
    description:
      'Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.',
    icon: tempicon,
  },
  {
    name: 'Advanced security',
    description:
      'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.',
    icon: tempicon,
  },
]

const Features = () => {
  return (
    <div id = 'features' className="bg-white py-5 sm:py-5">

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base/7 font-semibold text-green-600 rounded-md inset-ring inset-ring-gray-500/10">Deploy faster</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl lg:text-balance">
            Everything you need to deploy your app
          </p>
          <p className="mt-6 text-lg/8 text-gray-700">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum
            pulvinar et feugiat blandit at. In mi viverra elit nunc.
          </p>
        </div> */}

        <div className="flex justify-center">
        <div className="inline-flex items-center gap-2 text-sm text-green-600 bg-green-400/10 rounded-full px-4 py-1.5 whitespace-nowrap">
          <Zap width={14}/>
            <span>Simple Process</span>
        </div>
      </div>
        
        <div className="mx-auto mt-6 max-w-2xl text-center">
        <Title title={"Build your Resume"} description={"Our streamlined process helps you create a professional resume in minutes with intelligent AI-powered tools and features"}/>
        </div>

        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-7xl">
          {/* new two-column layout: image stack on left, feature list on right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* left: layered images with soft gradient */}
            <div className="relative flex justify-center">
              <div className="absolute -inset-8 rounded-3xl bg-gradient-to-br from-purple-50 to-pink-50 opacity-80 blur-[40px]"></div>
              <div className="relative w-[380px] lg:w-[420px]">
                <img
                  src="https://images.unsplash.com/photo-1542744095-291d1f67b221?auto=format&fit=crop&w=900&q=80"
                  alt=""
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=700&q=80"
                  alt=""
                  className="rounded-2xl shadow-2xl w-60 h-56 object-cover absolute -bottom-6 left-16 border-4 border-white"
                />
              </div>
            </div>

            {/* right: stylized feature list */}
            <div>
              <dl className="space-y-4">
                {features.map((f, idx) => {
                  // use hover: on the container so the div itself changes,
                  // keep group-hover on icon so icon changes when the row is hovered
                  const hoverContainer =
                    idx === 0
                      ? 'hover:bg-purple-50 hover:ring-1 hover:ring-purple-200'
                      : idx === 1
                      ? 'hover:bg-gray-50 hover:ring-1 hover:ring-green-100'
                      : idx === 2
                      ? 'hover:bg-amber-50 hover:ring-1 hover:ring-amber-100'
                      : 'hover:bg-indigo-50 hover:ring-1 hover:ring-indigo-100';

                  const iconHover =
                    idx === 0
                      ? 'group-hover:bg-purple-600 group-hover:text-white'
                      : idx === 1
                      ? 'group-hover:bg-gray-600 group-hover:text-white'
                      : idx === 2
                      ? 'group-hover:bg-amber-500 group-hover:text-white'
                      : 'group-hover:bg-indigo-600 group-hover:text-white';

                  return (
                    <div
                      key={f.name}
                      className={`group flex gap-4 p-4 rounded-2xl items-start bg-white/95 border border-gray-100 transition-all duration-300 hover:shadow-sm ${hoverContainer}`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg shrink-0 bg-green-100 text-green-600 transition-colors duration-300 ${iconHover}`}
                      >
                        <f.icon aria-hidden="true" className="size-5 text-current transition-colors duration-300" />
                      </div>
                      <div className="flex-1">
                        <dt className="text-base font-semibold text-gray-900 transition-colors duration-300 group-hover:text-gray-900">{f.name}</dt>
                        <dd className="mt-1 text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">{f.description}</dd>
                      </div>
                    </div>
                  )
                })}
              </dl>
           </div>
         </div>
       </div>
     </div>
    </div>
  )
}

export default Features;
