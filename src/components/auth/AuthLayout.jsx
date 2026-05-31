import { Link } from "react-router-dom";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      className="
        min-h-screen
        bg-slate-50
        flex
        items-center
        justify-center
        p-6
      "
    >
      <div
        className="
          w-full
          max-w-7xl

          overflow-hidden

          rounded-[32px]

          border
          border-white/10

          bg-white/5

          backdrop-blur-xl

          shadow-2xl

          grid
          lg:grid-cols-2
        "
      >
        {/* LEFT SIDE */}

        <div
          className="
            relative
            hidden
            lg:flex

            flex-col
            justify-between

            p-12

            bg-gradient-to-br
            from-indigo-700
            via-violet-700
            to-purple-900
          "
        >
          <div>
            <Link
              to="/"
              className="
                inline-flex
                items-center
                gap-2

                rounded-full

                bg-white/10

                px-4
                py-2

                text-sm
                font-semibold

                text-white
              "
            >
              🎓 DATN Social
            </Link>

            <h1
              className="
                mt-10

                text-5xl
                font-black

                leading-tight

                text-white
              "
            >
              Học tập
              <br />
              kết nối
              <br />
              và phát triển
            </h1>

            <p
              className="
                mt-6

                max-w-lg

                text-lg

                text-indigo-100
              "
            >
              Nền tảng giúp học sinh, sinh viên chia sẻ kiến thức, tham gia nhóm
              học, làm quiz và phát triển kỹ năng cùng nhau.
            </p>
          </div>

          <div className="space-y-4">
            <Feature icon="📚" text="Tạo và chia sẻ tài liệu học tập" />
            <Feature icon="👥" text="Tham gia nhóm học tập" />
            <Feature icon="📝" text="Tạo quiz và kiểm tra kiến thức" />
            <Feature icon="🏆" text="Theo dõi tiến độ học tập" />
          </div>

          {/* Glow */}
          <div
            className="
              absolute
              right-0
              top-0

              h-96
              w-96

              rounded-full

              bg-white/10

              blur-3xl
            "
          />
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
            flex
            items-center
            justify-center

            bg-white

            p-8
            lg:p-12
          "
        >
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h2
                className="
                  text-3xl
                  font-bold
                  text-slate-900
                "
              >
                {title}
              </h2>

              {subtitle && (
                <p
                  className="
                    mt-2
                    text-slate-500
                  "
                >
                  {subtitle}
                </p>
              )}
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, text }) {
  return (
    <div
      className="
        flex
        items-center
        gap-3

        rounded-2xl

        bg-white/10

        p-4

        backdrop-blur
      "
    >
      <span className="text-2xl">{icon}</span>

      <span
        className="
          font-medium
          text-white
        "
      >
        {text}
      </span>
    </div>
  );
}
