import React, { ChangeEvent, useCallback, useMemo } from "react";
import { css } from "@emotion/react";

import { usePointCloudStore } from "@phoenix/store";

import { VisibilityCheckboxField } from "./VisibilityCheckboxField";

/**
 * Small checkbox form that controls the visibility of each point group.
 * E.x. "true positives", "false positives", "false negatives", etc.
 */
export function PointGroupVisibilitySettings() {
  const { pointGroupVisibility, setPointGroupVisibility, pointGroupColors } =
    usePointCloudStore((state) => ({
      pointGroupVisibility: state.pointGroupVisibility,
      pointGroupColors: state.pointGroupColors,
      setPointGroupVisibility: state.setPointGroupVisibility,
    }));

  const pointGroups = useMemo(
    () => Object.keys(pointGroupVisibility),
    [pointGroupVisibility]
  );

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { name, checked } = event.target;
      setPointGroupVisibility({
        ...pointGroupVisibility,
        [name]: checked,
      });
    },
    [pointGroupVisibility, setPointGroupVisibility]
  );
  return (
    <form
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <PointGroupCheckbox />
      <div
        css={css`
          padding: var(--px-padding-med);
        `}
      >
        {pointGroups.map((groupName) => {
          const groupVisibility = pointGroupVisibility[groupName];
          const groupColor = pointGroupColors[groupName];
          return (
            <VisibilityCheckboxField
              key={groupName}
              name={groupName}
              checked={groupVisibility}
              color={groupColor}
              onChange={onChange}
            />
          );
        })}
      </div>
    </form>
  );
}

/**
 * A checkbox that controls the entire group of points
 */
function PointGroupCheckbox() {
  const { pointGroupVisibility, setPointGroupVisibility, coloringStrategy } =
    usePointCloudStore((state) => ({
      pointGroupVisibility: state.pointGroupVisibility,
      setPointGroupVisibility: state.setPointGroupVisibility,
      coloringStrategy: state.coloringStrategy,
    }));

  const allNotVisible = useMemo(
    () => Object.values(pointGroupVisibility).every((visible) => !visible),
    [pointGroupVisibility]
  );

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { checked } = e.target;
      const newPointGroupVisibility = Object.keys(pointGroupVisibility).reduce(
        (acc, groupName) => {
          acc[groupName] = checked;
          return acc;
        },
        {} as Record<string, boolean>
      );
      setPointGroupVisibility(newPointGroupVisibility);
    },
    [pointGroupVisibility, setPointGroupVisibility]
  );

  return (
    <label
      css={() => css`
        display: flex;
        flex-direction: row;
        gap: var(--px-flex-gap-sm);
        padding: var(--px-padding-sm) var(--px-padding-med);
        background-color: var(--px-section-background-color);
      `}
    >
      <input type="checkbox" checked={!allNotVisible} onChange={onChange} />
      {`${coloringStrategy}`}
    </label>
  );
}
