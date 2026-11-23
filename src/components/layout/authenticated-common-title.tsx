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
      <h1 className="text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
        {title}
      </h1>

      {subTitle &&
        <p className="text-sm text-on-surface-variant">
          {subTitle}
        </p>
      }
    </div>

  )
}
