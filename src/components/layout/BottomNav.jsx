import { NavLink, useLocation } from "react-router";
import { BOTTOM_NAV_ITEMS } from "../../config/navigation";
import { isPrimaryNavActive } from "../../config/navigation";

export default function BottomNav() {
    const location = useLocation();

    return (
        <nav className="bottom-nav" aria-label="Điều hướng nhanh">
            {BOTTOM_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                if (item.action === "game-catalog") {
                    const active = isPrimaryNavActive(item, location.pathname);
                    return (
                        <button
                            key={item.to}
                            type="button"
                            className={active ? "active" : undefined}
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("mbn:open-game-catalog"),
                                )
                            }
                        >
                            <Icon />
                            <span>{item.label}</span>
                        </button>
                    );
                }
                return (
                    <NavLink key={item.to} to={item.to} end={item.to === "/"}>
                        <Icon />
                        <span>{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
}
