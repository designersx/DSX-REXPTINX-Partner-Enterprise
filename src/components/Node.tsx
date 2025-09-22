"use client";

import React from "react";
import Draggable from "react-draggable";
import { Card, CardContent, Typography } from "@mui/material";

export function Node({ node, position, onClick, onDrag }: any) {
  return (
    <Draggable position={position} onDrag={onDrag} bounds="parent">
      <div style={{ position: "absolute" }}>
        <Card
          onClick={onClick}
          sx={{
            width: 200,
            cursor: "pointer",
            border: "2px solid #1976d2",
          }}
        >
          <CardContent>
            <Typography variant="subtitle1">{node.name}</Typography>
            <Typography variant="caption">{node.type}</Typography>
          </CardContent>
        </Card>
      </div>
    </Draggable>
  );
}
