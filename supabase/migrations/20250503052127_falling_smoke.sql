-- Create function to replenish tattoos
CREATE OR REPLACE FUNCTION replenish_tattoos()
RETURNS SETOF tattoos
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_tattoo tattoos%ROWTYPE;
    styles text[] := ARRAY['geometric', 'mandala', 'watercolor', 'blackwork', 'traditional', 'tribal', 'japanese', 'minimalist', 'dotwork'];
    selected_style text;
    base_images text[] := ARRAY[
        'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hackin_american_indian_geometric_tattoo_design_white_background_3072eaf8-6641-42a1-b248-9fb141c8ab51.png',
        'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/hacabana_wolf_geometric_tattoo_design_white_background_3654706e-84be-40f5-9aa5-6fee6a594f66.png',
        'https://oylqtgphuufoslmdconu.supabase.co/storage/v1/object/public/tattoos/tatoo/PREFERiDA.png'
    ];
    selected_image text;
BEGIN
    -- Add 3 new tattoos
    FOR i IN 1..3 LOOP
        -- Select random style and image
        selected_style := styles[floor(random() * array_length(styles, 1)) + 1];
        selected_image := base_images[floor(random() * array_length(base_images, 1)) + 1];
        
        -- Insert new tattoo
        INSERT INTO tattoos (
            title,
            description,
            image_url,
            preview_url,
            price,
            status,
            style
        ) VALUES (
            'Tattoo ' || selected_style || ' #' || floor(random() * 1000)::text,
            'Design exclusivo em estilo ' || selected_style,
            selected_image,
            selected_image,
            (floor(random() * (500 - 200 + 1) + 200))::numeric(10,2),
            'disponível',
            selected_style
        ) RETURNING * INTO new_tattoo;
        
        RETURN NEXT new_tattoo;
    END LOOP;
    
    RETURN;
END;
$$;