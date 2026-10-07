import { render, screen, fireEvent } from "@testing-library/react";
import { Modal } from "@/components/ui";

beforeEach(() => {
  /** Models opening a dialog in jsdom. */
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.setAttribute("open", "");
  };
  /** Models closing a dialog in jsdom. */
  HTMLDialogElement.prototype.close = function close() {
    this.removeAttribute("open");
  };
});

test("restores focus to the opening control when unmounted", () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const { unmount } = render(
    <Modal title="Demo" onClose={jest.fn()}>
      <input aria-label="Name" />
    </Modal>,
  );
  screen.getByLabelText("Name").focus();
  unmount();
  expect(document.activeElement).toBe(trigger);
  trigger.remove();
});

test("closing remains safe when the opener has been removed", () => {
  const trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  const { unmount } = render(
    <Modal title="Demo" onClose={jest.fn()}>
      Body
    </Modal>,
  );
  trigger.remove();
  expect(unmount).not.toThrow();
});

test("Escape cancellation cannot close a busy dialog", () => {
  const close = jest.fn();
  render(
    <Modal title="Demo" busy onClose={close}>
      Body
    </Modal>,
  );
  fireEvent(
    screen.getByRole("dialog"),
    new Event("cancel", { bubbles: true, cancelable: true }),
  );
  expect(close).not.toHaveBeenCalled();
});
