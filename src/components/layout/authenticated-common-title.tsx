interface IAuthenticatedCommonTitle {
  title: string
  subTitle?: string
}

export function AuthenticatedCommonTitle({
  title,
  subTitle
}: IAuthenticatedCommonTitle) {
  return (
    <div className="flex flex-col items-start gap-1">
      <h1 className="text-4xl text-[#E2E2E2] font-bold">
        {title}
      </h1>

      {subTitle &&
        <p className="text-base text-[#D1C6AB]">
          {subTitle}
        </p>
      }
    </div>

  )
}