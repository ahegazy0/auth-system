'use client';

interface OAuthButtonsProps {
  onOAuthClick: (provider: string) => void;
  googleEnabled?: boolean;
  githubEnabled?: boolean;
  microsoftEnabled?: boolean;
}

export default function OAuthButtons({
  onOAuthClick,
  googleEnabled = process.env.NEXT_PUBLIC_ENABLE_GOOGLE === 'true',
  githubEnabled = process.env.NEXT_PUBLIC_ENABLE_GITHUB === 'true',
  microsoftEnabled = process.env.NEXT_PUBLIC_ENABLE_MICROSOFT === 'true',
}: OAuthButtonsProps) {
  const Btn = ({
    provider,
    label,
    className,
    icon,
  }: { provider: string; label: string; className: string; icon: string }) => (
    <button
      onClick={() => onOAuthClick(provider)}
      className={`w-full inline-flex justify-center items-center gap-2 py-2 px-4 rounded-md shadow-sm transition-colors ${className}`}
      type="button"
    >
      <img className="h-5 w-5" src={`/${icon}.svg`} alt={label} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );

  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {googleEnabled && (
          <Btn
            provider="google"
            label="Google"
            icon="google"
            className="border border-gray-600 bg-blur-800 text-gray-200 hover:bg-gray-700"
          />
        )}
        {githubEnabled && (
          <Btn
            provider="github"
            label="GitHub"
            icon="github"
            className="border border-gray-600 bg-blur-900 text-white hover:bg-black"
          />
        )}
        {microsoftEnabled && (
          <Btn
            provider="microsoft"
            label="Microsoft"
            icon="microsoft"
            className="border border-gray-600 bg-blur-600 text-white hover:bg-blue-700"
          />
        )}
      </div>
    </div>
  );
}
