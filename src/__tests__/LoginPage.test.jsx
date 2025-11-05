import { render, screen } from "@testing-library/react";
import LoginPage from "../pages/LoginPage";

describe("LoginPage", () => {
  it("renders login form correctly", () => {
    render(<LoginPage />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
