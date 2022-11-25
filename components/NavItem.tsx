import { useRouter } from "next/dist/client/router";
import Link from "next/link";

const NavItem = ({ text, link }: any) => {
	const router = useRouter();

	let focus = router.pathname === link;
	if (
		router.pathname === "/stake-ethereum" ||
		router.pathname === "/stake-polygon"
	) {
		if (link === "/stake") {
			focus = true;
		}
	}

	const dict = {
		home: "&#xe901;",
		valuation: "&#xe902;",
		nftValuation: "&#xe904;",
		swap: "&#xe906;",
		stake: "&#xe905;",
		liquidity: "&#xe903;",
		gobernance: "&#xe900;",
	};

	function getIcon(link: any) {
		switch (link) {
			case "/":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe901;
					</div>
				);
			case "/swap":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe906;
					</div>
				);
			case "/liquidity":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe903;
					</div>
				);
			case "/stake":
			case "/stake-ethereum":
			case "stake-polygon":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe905;
					</div>
				);
			case "https://snapshot.org/#/metagamehub.eth" || "/pools":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe900;
					</div>
				);
			case "/valuation":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe902;
					</div>
				);
			case "/nftValuation":
				return (
					<div
						className={`text-5xl z-10 ${
							focus && "text-grey-icon"
						} group-hover:text-grey-icon nav-link__icon`}
					>
						&#xe904;
					</div>
				);
		}
	}

	return (
		<>
			<Link href={link}>
				<a
					className={`${
						focus ? "  shadowNavItem" : "shadowNormal"
					} hover:shadowNavItem relative flex items-center rounded-xl px-2 py-2 text-grey-icon w-full `}
				>
					<span
						className={`${
							focus ? "shadowNavItem" : "shadowNormal"
						} hidden h-full w-full absolute  rounded-xl blur-xl`}
					/>
					{getIcon(link)}
					{/* <span className="pt-1.5 z-10">{text}</span> */}
				</a>
			</Link>
		</>
	);
};

export default NavItem;
